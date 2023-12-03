# Accounting App Made As A Coding Challenge 

This is a simple accounting app that uses [immudb Vault](https://vault.immudb.io/docs/) as a storage backend.

It allows you to create accounts and transactions connected to those accounts.

## Quickstart

[Sign up](https://vault.immudb.io/auth/signup) for a free Vault account and obtain an API key for read/write access.

Run the app using Docker:
```bash
docker run --rm -p 8081:8081 -e VAULT_APIKEY=<--YOUR-API-KEY--> piha/codenotary-vault-ledger:latest
```

Vault collections are created automatically when you first run the app.

The app will be available at http://localhost:8081

## API Reference
gRPC API documentation is available at https://buf.build/ilyatikhonov/codenotary-vault-ledger/docs/main:account_service


## Implementation details

The app is written in Go, it exposes a gRPC API (both normal gRPC and gRPC-Web) and a web frontend written in TypeScript + React + Material UI.

The gRPC API is defined in [accountservice.proto](./proto/accountservice.proto).

immudb Vault REST client is generated from the OpenAPI specs.

Repository structure:
- [/src](./src) - web frontend
- [/src-go](./src-go) - Go backend
- [/server.go](./server.go) - entrypoint for the app

Configuration is done via environment variables:
- `VAULT_APIKEY` - API key for immudb Vault
- `SERVINGADDRESS` - address to serve the app on, defaults to `:8081'
- `VAULT_ACCOUNTSCOLLECTIONNAME` - name of the collection to use for storing accounts, defaults to `accounts`
- `VAULT_TRANSACTIONSCOLLECTIONNAME` - name of the collection to use for storing transactions, defaults to `transactions`
- `VAULT_WEBDISABLECORS` - set to `true` to disable CORS for the gRPC-Web API, defaults to `false`
- `VAULT_LEDGERNAME` - name of the ledger to use, defaults to `default`

The app serves the web frontend, the HTTP2 gRPC API and the gRPC-Web API on the same port using basic multiplexing.


## Development
Tasks are defined in [Taskfile.yml](./Taskfile.yml) and can be run using [Task](https://taskfile.dev/installation/).

To run the app locally:
```bash
task buildweb
task run
```




