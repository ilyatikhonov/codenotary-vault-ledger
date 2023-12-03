package server

import (
	"context"
	"errors"
	"fmt"
	pb "github.com/ilyatikhonov/codenotary-vault-ledger/src-go/proto"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type AccountService struct {
	vaultStorage *VaultStorage
	pb.UnimplementedAccountServiceServer
}

func (s *AccountService) ListAccounts(ctx context.Context, in *pb.ListAccountsRequest) (*pb.ListAccountsResponse, error) {
	accounts, count, err := s.vaultStorage.ListAccounts(
		ctx, int(in.PageSize), int(in.PageNumber),
	)
	if err != nil {
		return nil, fmt.Errorf("error listing accounts: %w", err)
	}
	var pbAccounts []*pb.Account
	for _, account := range accounts {
		pbAccounts = append(pbAccounts, &pb.Account{
			Id:      account.Id,
			Number:  account.Number,
			Name:    account.Name,
			Address: account.Address,
			Iban:    account.IBAN,
		})
	}
	return &pb.ListAccountsResponse{
		PageSize:   in.PageSize,
		PageNumber: in.PageNumber,
		TotalCount: int32(count),
		Accounts:   pbAccounts,
	}, nil
}

func (s *AccountService) ListTransactions(ctx context.Context, in *pb.ListTransactionsRequest) (*pb.ListTransactionsResponse, error) {
	transactions, count, err := s.vaultStorage.ListTransactions(
		ctx, in.AccountNumber, int(in.PageSize), int(in.PageNumber),
	)
	if err != nil {
		return nil, fmt.Errorf("error listing transactions: %w", err)
	}
	var pbTransactions []*pb.Transaction
	for _, transaction := range transactions {
		pbTransactions = append(pbTransactions, &pb.Transaction{
			Id:            transaction.Id,
			AccountNumber: transaction.AccountNumber,
			Amount:        transaction.Amount,
			Type:          pb.TransactionType(pb.TransactionType_value[transaction.Type]),
		})
	}

	return &pb.ListTransactionsResponse{
		PageSize:     in.PageSize,
		PageNumber:   in.PageNumber,
		TotalCount:   int32(count),
		Transactions: pbTransactions,
	}, nil
}

func (s *AccountService) CreateAccount(ctx context.Context, in *pb.Account) (*pb.CreateAccountResponse, error) {
	id, err := s.vaultStorage.AddAccount(ctx, AccountRecord{
		Number:  in.Number,
		Name:    in.Name,
		Address: in.Address,
		IBAN:    in.Iban,
	})
	if errors.Is(err, DuplicateKeyError) {
		return nil, status.Errorf(codes.AlreadyExists, "`Account Number` already exists")
	}
	if errors.Is(err, InvalidInputError) {
		return nil, status.Errorf(codes.InvalidArgument, err.Error())
	}
	if err != nil {
		return nil, fmt.Errorf("error creating account: %w", err)
	}
	return &pb.CreateAccountResponse{Id: id}, nil
}

func (s *AccountService) CreateTransaction(ctx context.Context, in *pb.Transaction) (*pb.CreateTransactionResponse, error) {
	id, err := s.vaultStorage.AddTransaction(ctx, TransactionRecord{
		AccountNumber: in.AccountNumber,
		Amount:        in.Amount,
		Type:          in.Type.String(),
	})
	if errors.Is(err, InvalidInputError) {
		return nil, status.Errorf(codes.InvalidArgument, err.Error())
	}
	if err != nil {
		return nil, fmt.Errorf("error creating transaction: %w", err)
	}
	return &pb.CreateTransactionResponse{Id: id}, nil
}
