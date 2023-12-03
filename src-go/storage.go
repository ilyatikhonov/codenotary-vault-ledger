package server

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/deepmap/oapi-codegen/pkg/securityprovider"
	. "github.com/ilyatikhonov/codenotary-vault-ledger/src-go/vaultclient"
)

// VaultStorage is a service that stores the models in Vault
type VaultStorage struct {
	client *ClientWithResponses
	config VaultConfig
}

type VaultConfig struct {
	Host                       string `default:"https://vault.immudb.io/ics/api/v1"`
	ApiKey                     string `required:"true"`
	LedgerName                 string `default:"default"`
	AccountsCollectionName     string `required:"true"` //`default:"accounts"`
	TransactionsCollectionName string `default:"transactions"`
}

var DuplicateKeyError = fmt.Errorf("duplicate key")
var InvalidInputError = fmt.Errorf("invalid input")

func NewVaultStorage(config VaultConfig) (*VaultStorage, error) {
	apiKeyProvider, err := securityprovider.NewSecurityProviderApiKey("header", "X-API-Key", config.ApiKey)
	if err != nil {
		return nil, fmt.Errorf("error creating vault client: %w", err)
	}

	client, err := NewClientWithResponses(config.Host, WithRequestEditorFn(apiKeyProvider.Intercept))
	if err != nil {
		return nil, fmt.Errorf("error creating vault client: %w", err)
	}

	return &VaultStorage{client, config}, nil
}

func (v *VaultStorage) ListAccounts(ctx context.Context, pageSize int, pageNumber int) ([]AccountRecord, int, error) {
	return listDocuments[AccountRecord](
		ctx, v.client, v.config.LedgerName, v.config.AccountsCollectionName, pageSize, pageNumber, nil,
	)
}

func (v *VaultStorage) ListTransactions(ctx context.Context, accountNumber string, pageSize int, pageNumber int) ([]TransactionRecord, int, error) {
	return listDocuments[TransactionRecord](
		ctx, v.client, v.config.LedgerName, v.config.TransactionsCollectionName, pageSize, pageNumber,
		&Query{
			Expressions: &[]QueryExpression{
				{FieldComparisons: &[]FieldComparison{
					{Field: "account_number", Operator: EQ, Value: accountNumber},
				}},
			},
		},
	)
}

// listDocuments is a generic function to list documents from Vault
func listDocuments[T AccountRecord | TransactionRecord](
	ctx context.Context,
	client *ClientWithResponses,
	ledgerName string,
	collectionName string,
	pageSize int,
	pageNumber int,
	query *Query,
) ([]T, int, error) {
	r, err := client.SearchDocumentWithResponse(context.Background(), ledgerName, collectionName,
		DocumentSearchRequest{
			Page:    pageNumber,
			PerPage: pageSize,
			Query:   query,
		},
	)
	if err != nil {
		return nil, 0, fmt.Errorf("error searching documents: %w", err)
	}

	if r.StatusCode() != 200 {
		return nil, 0, fmt.Errorf("bad response searching for documents: %s %s", r.Status(), r.Body)
	}

	var docs []T
	for _, d := range r.JSON200.Revisions {
		// Add id field from system field _id
		d.Document["id"] = d.Document["_id"]

		// Unmarshall documents
		jstr, err := json.Marshal(d.Document)
		if err != nil {
			return nil, 0, fmt.Errorf("error marshalling document: %w", err)
		}
		var doc T
		err = json.Unmarshal(jstr, &doc)
		if err != nil {
			return nil, 0, fmt.Errorf("error unmarshalling document: %w", err)
		}
		docs = append(docs, doc)
	}

	// Count total amount of documents
	rc, err := client.CountDocumentsWithResponse(ctx, ledgerName, collectionName, DocumentCountRequest{
		Query: query,
	})
	if err != nil {
		return nil, 0, fmt.Errorf("error counting documents: %w", err)
	}
	if r.StatusCode() != 200 {
		return nil, 0, fmt.Errorf("bad response counting documents: %s %s", r.Status(), r.Body)
	}
	return docs, rc.JSON200.Count, nil
}

func (v *VaultStorage) AddAccount(ctx context.Context, account AccountRecord) (string, error) {
	return v.addDocuments(ctx, v.config.AccountsCollectionName, account)
}

func (v *VaultStorage) AddTransaction(ctx context.Context, transaction TransactionRecord) (string, error) {
	return v.addDocuments(ctx, v.config.TransactionsCollectionName, transaction)
}

// addDocuments is a generic function to add documents to Vault
func (v *VaultStorage) addDocuments(ctx context.Context, collectionName string, record Validateble) (string, error) {
	if err := record.Validate(); err != nil {
		return "", err
	}
	r, err := v.client.DocumentCreateWithResponse(ctx, v.config.LedgerName, collectionName, record)

	// already exists
	if r != nil && r.StatusCode() == 409 {
		return "", DuplicateKeyError
	}

	if err != nil || r.StatusCode() != 200 {
		return "", fmt.Errorf("can'a add doc to Vault resp=%s %s doc=%s err=%w", r.Status(), r.Body, record, err)
	}
	return r.JSON200.DocumentId, nil
}

// InitCollections creates collections in Vault if they don't exist
func (v *VaultStorage) InitCollections(ctx context.Context) error {
	var FieldString = FieldType("STRING")
	r, err := v.client.CollectionCreateWithResponse(ctx, v.config.LedgerName, v.config.AccountsCollectionName,
		CollectionCreateRequest{
			Fields: &[]Field{
				{"number", &FieldString},
			},
			Indexes: &[]Index{
				{[]string{"number"}, true},
			},
		},
	)
	if err != nil || (r.StatusCode() != 200 && r.StatusCode() != 409) { // 409 - already exists
		return fmt.Errorf("error creating collection %s resp=%s err=%w", v.config.AccountsCollectionName, r.Status(), err)
	}

	r, err = v.client.CollectionCreateWithResponse(ctx, v.config.LedgerName, v.config.TransactionsCollectionName,
		CollectionCreateRequest{
			Fields: &[]Field{
				{"account_number", &FieldString},
			},
			Indexes: &[]Index{
				{[]string{"account_number"}, false},
			},
		},
	)

	if err != nil || (r.StatusCode() != 200 && r.StatusCode() != 409) { // 409 - already exists
		return fmt.Errorf("error creating collection %s resp=%s err=%w", v.config.TransactionsCollectionName, r.Status(), err)
	}
	return nil
}
