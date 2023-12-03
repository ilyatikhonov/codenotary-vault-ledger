// package: account_service
// file: proto/accountservice.proto

import * as jspb from "google-protobuf";

export class Account extends jspb.Message {
  getNumber(): string;
  setNumber(value: string): void;

  getName(): string;
  setName(value: string): void;

  getAddress(): string;
  setAddress(value: string): void;

  getIban(): string;
  setIban(value: string): void;

  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Account.AsObject;
  static toObject(includeInstance: boolean, msg: Account): Account.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Account, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Account;
  static deserializeBinaryFromReader(message: Account, reader: jspb.BinaryReader): Account;
}

export namespace Account {
  export type AsObject = {
    number: string,
    name: string,
    address: string,
    iban: string,
    id: string,
  }
}

export class Transaction extends jspb.Message {
  getAccountNumber(): string;
  setAccountNumber(value: string): void;

  getAmount(): number;
  setAmount(value: number): void;

  getType(): TransactionTypeMap[keyof TransactionTypeMap];
  setType(value: TransactionTypeMap[keyof TransactionTypeMap]): void;

  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Transaction.AsObject;
  static toObject(includeInstance: boolean, msg: Transaction): Transaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Transaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Transaction;
  static deserializeBinaryFromReader(message: Transaction, reader: jspb.BinaryReader): Transaction;
}

export namespace Transaction {
  export type AsObject = {
    accountNumber: string,
    amount: number,
    type: TransactionTypeMap[keyof TransactionTypeMap],
    id: string,
  }
}

export class ListAccountsRequest extends jspb.Message {
  getPageSize(): number;
  setPageSize(value: number): void;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAccountsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListAccountsRequest): ListAccountsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListAccountsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAccountsRequest;
  static deserializeBinaryFromReader(message: ListAccountsRequest, reader: jspb.BinaryReader): ListAccountsRequest;
}

export namespace ListAccountsRequest {
  export type AsObject = {
    pageSize: number,
    pageNumber: number,
  }
}

export class ListAccountsResponse extends jspb.Message {
  getPageSize(): number;
  setPageSize(value: number): void;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  clearAccountsList(): void;
  getAccountsList(): Array<Account>;
  setAccountsList(value: Array<Account>): void;
  addAccounts(value?: Account, index?: number): Account;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAccountsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListAccountsResponse): ListAccountsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListAccountsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAccountsResponse;
  static deserializeBinaryFromReader(message: ListAccountsResponse, reader: jspb.BinaryReader): ListAccountsResponse;
}

export namespace ListAccountsResponse {
  export type AsObject = {
    pageSize: number,
    pageNumber: number,
    totalCount: number,
    accountsList: Array<Account.AsObject>,
  }
}

export class ListTransactionsRequest extends jspb.Message {
  getPageSize(): number;
  setPageSize(value: number): void;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  getAccountNumber(): string;
  setAccountNumber(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListTransactionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListTransactionsRequest): ListTransactionsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListTransactionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListTransactionsRequest;
  static deserializeBinaryFromReader(message: ListTransactionsRequest, reader: jspb.BinaryReader): ListTransactionsRequest;
}

export namespace ListTransactionsRequest {
  export type AsObject = {
    pageSize: number,
    pageNumber: number,
    accountNumber: string,
  }
}

export class ListTransactionsResponse extends jspb.Message {
  getPageSize(): number;
  setPageSize(value: number): void;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  clearTransactionsList(): void;
  getTransactionsList(): Array<Transaction>;
  setTransactionsList(value: Array<Transaction>): void;
  addTransactions(value?: Transaction, index?: number): Transaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListTransactionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListTransactionsResponse): ListTransactionsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListTransactionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListTransactionsResponse;
  static deserializeBinaryFromReader(message: ListTransactionsResponse, reader: jspb.BinaryReader): ListTransactionsResponse;
}

export namespace ListTransactionsResponse {
  export type AsObject = {
    pageSize: number,
    pageNumber: number,
    totalCount: number,
    transactionsList: Array<Transaction.AsObject>,
  }
}

export class CreateAccountResponse extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateAccountResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateAccountResponse): CreateAccountResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateAccountResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateAccountResponse;
  static deserializeBinaryFromReader(message: CreateAccountResponse, reader: jspb.BinaryReader): CreateAccountResponse;
}

export namespace CreateAccountResponse {
  export type AsObject = {
    id: string,
  }
}

export class CreateTransactionResponse extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateTransactionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateTransactionResponse): CreateTransactionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateTransactionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateTransactionResponse;
  static deserializeBinaryFromReader(message: CreateTransactionResponse, reader: jspb.BinaryReader): CreateTransactionResponse;
}

export namespace CreateTransactionResponse {
  export type AsObject = {
    id: string,
  }
}

export interface TransactionTypeMap {
  DEPOSIT: 0;
  WITHDRAWAL: 1;
}

export const TransactionType: TransactionTypeMap;

