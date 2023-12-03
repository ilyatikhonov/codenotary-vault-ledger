package server

import "fmt"

type AccountRecord struct {
	Id      string `json:"id"`
	Number  string `json:"number"`
	Name    string `json:"name"`
	Address string `json:"address"`
	IBAN    string `json:"iban"`
}

func (a AccountRecord) Validate() error {
	if a.Number == "" {
		return fmt.Errorf("%w: number is empty", InvalidInputError)
	}
	if a.Name == "" {
		return fmt.Errorf("%w: name is empty", InvalidInputError)
	}
	return nil
}

type TransactionRecord struct {
	Id            string `json:"id"`
	AccountNumber string `json:"account_number"`
	Amount        int64  `json:"amount"`
	Type          string `json:"type"`
}

func (t TransactionRecord) Validate() error {
	if t.AccountNumber == "" {
		return fmt.Errorf("%w: account number is empty", InvalidInputError)
	}
	if t.Amount == 0 {
		return fmt.Errorf("%w: amount is empty", InvalidInputError)
	}
	if t.Type == "" {
		return fmt.Errorf("%w: type is empty", InvalidInputError)
	}
	return nil
}

type Validateble interface {
	Validate() error
}
