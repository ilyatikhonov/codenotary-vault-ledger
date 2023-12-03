// package: account_service
// file: proto/accountservice.proto

import * as proto_accountservice_pb from "../proto/accountservice_pb";
import {grpc} from "@improbable-eng/grpc-web";

type AccountServiceListAccounts = {
  readonly methodName: string;
  readonly service: typeof AccountService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_accountservice_pb.ListAccountsRequest;
  readonly responseType: typeof proto_accountservice_pb.ListAccountsResponse;
};

type AccountServiceListTransactions = {
  readonly methodName: string;
  readonly service: typeof AccountService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_accountservice_pb.ListTransactionsRequest;
  readonly responseType: typeof proto_accountservice_pb.ListTransactionsResponse;
};

type AccountServiceCreateAccount = {
  readonly methodName: string;
  readonly service: typeof AccountService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_accountservice_pb.Account;
  readonly responseType: typeof proto_accountservice_pb.CreateAccountResponse;
};

type AccountServiceCreateTransaction = {
  readonly methodName: string;
  readonly service: typeof AccountService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_accountservice_pb.Transaction;
  readonly responseType: typeof proto_accountservice_pb.CreateTransactionResponse;
};

export class AccountService {
  static readonly serviceName: string;
  static readonly ListAccounts: AccountServiceListAccounts;
  static readonly ListTransactions: AccountServiceListTransactions;
  static readonly CreateAccount: AccountServiceCreateAccount;
  static readonly CreateTransaction: AccountServiceCreateTransaction;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class AccountServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  listAccounts(
    requestMessage: proto_accountservice_pb.ListAccountsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_accountservice_pb.ListAccountsResponse|null) => void
  ): UnaryResponse;
  listAccounts(
    requestMessage: proto_accountservice_pb.ListAccountsRequest,
    callback: (error: ServiceError|null, responseMessage: proto_accountservice_pb.ListAccountsResponse|null) => void
  ): UnaryResponse;
  listTransactions(
    requestMessage: proto_accountservice_pb.ListTransactionsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_accountservice_pb.ListTransactionsResponse|null) => void
  ): UnaryResponse;
  listTransactions(
    requestMessage: proto_accountservice_pb.ListTransactionsRequest,
    callback: (error: ServiceError|null, responseMessage: proto_accountservice_pb.ListTransactionsResponse|null) => void
  ): UnaryResponse;
  createAccount(
    requestMessage: proto_accountservice_pb.Account,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_accountservice_pb.CreateAccountResponse|null) => void
  ): UnaryResponse;
  createAccount(
    requestMessage: proto_accountservice_pb.Account,
    callback: (error: ServiceError|null, responseMessage: proto_accountservice_pb.CreateAccountResponse|null) => void
  ): UnaryResponse;
  createTransaction(
    requestMessage: proto_accountservice_pb.Transaction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_accountservice_pb.CreateTransactionResponse|null) => void
  ): UnaryResponse;
  createTransaction(
    requestMessage: proto_accountservice_pb.Transaction,
    callback: (error: ServiceError|null, responseMessage: proto_accountservice_pb.CreateTransactionResponse|null) => void
  ): UnaryResponse;
}

