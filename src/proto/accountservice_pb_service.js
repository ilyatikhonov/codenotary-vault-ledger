// package: account_service
// file: proto/accountservice.proto

var proto_accountservice_pb = require("../proto/accountservice_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var AccountService = (function () {
  function AccountService() {}
  AccountService.serviceName = "account_service.AccountService";
  return AccountService;
}());

AccountService.ListAccounts = {
  methodName: "ListAccounts",
  service: AccountService,
  requestStream: false,
  responseStream: false,
  requestType: proto_accountservice_pb.ListAccountsRequest,
  responseType: proto_accountservice_pb.ListAccountsResponse
};

AccountService.ListTransactions = {
  methodName: "ListTransactions",
  service: AccountService,
  requestStream: false,
  responseStream: false,
  requestType: proto_accountservice_pb.ListTransactionsRequest,
  responseType: proto_accountservice_pb.ListTransactionsResponse
};

AccountService.CreateAccount = {
  methodName: "CreateAccount",
  service: AccountService,
  requestStream: false,
  responseStream: false,
  requestType: proto_accountservice_pb.Account,
  responseType: proto_accountservice_pb.CreateAccountResponse
};

AccountService.CreateTransaction = {
  methodName: "CreateTransaction",
  service: AccountService,
  requestStream: false,
  responseStream: false,
  requestType: proto_accountservice_pb.Transaction,
  responseType: proto_accountservice_pb.CreateTransactionResponse
};

exports.AccountService = AccountService;

function AccountServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

AccountServiceClient.prototype.listAccounts = function listAccounts(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccountService.ListAccounts, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccountServiceClient.prototype.listTransactions = function listTransactions(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccountService.ListTransactions, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccountServiceClient.prototype.createAccount = function createAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccountService.CreateAccount, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccountServiceClient.prototype.createTransaction = function createTransaction(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccountService.CreateTransaction, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.AccountServiceClient = AccountServiceClient;

