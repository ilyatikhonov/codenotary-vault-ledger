package server

import (
	"context"
	"fmt"
	pb "github.com/ilyatikhonov/codenotary-vault-ledger/src-go/proto"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"google.golang.org/grpc"
)

type GrpcServersConfig struct {
	WebGrpcDisableCORS bool `default:"true"`
	VaultConfig
}

// GetGrpcServers initializes the account service according to the `conf`
// and returns a normal grpc server and a grpc-web version which are ready to serve
func GetGrpcServers(conf GrpcServersConfig) (*grpc.Server, *grpcweb.WrappedGrpcServer, error) {

	storage, err := NewVaultStorage(conf.VaultConfig)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to start vault storage: %w", err)
	}

	// create collections in the Vault if not exist
	err = storage.InitCollections(context.Background())
	if err != nil {
		return nil, nil, fmt.Errorf("failed to init collections: %w", err)
	}

	// start the service
	accountServiceServer := &AccountService{vaultStorage: storage}

	// create a normal grpc server
	grpcServer := grpc.NewServer()
	pb.RegisterAccountServiceServer(grpcServer, accountServiceServer)

	// create a grpc-web version of the server
	grpcWebServer := grpcweb.WrapServer(
		grpcServer,
		grpcweb.WithOriginFunc(func(origin string) bool {
			return conf.WebGrpcDisableCORS
		},
		))

	return grpcServer, grpcWebServer, nil
}
