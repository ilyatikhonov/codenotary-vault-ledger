package main

import (
	"embed"
	"github.com/MadAppGang/httplog"
	. "github.com/ilyatikhonov/codenotary-vault-ledger/src-go"
	"github.com/kelseyhightower/envconfig"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	"io/fs"
	"log"
	. "net/http"
	"os"
	"strings"
)

type Config struct {
	ServingAddress    string            `default:":8081"`
	GrpcServersConfig GrpcServersConfig `envconfig:"VAULT"`
}

//go:embed build
var webStaticEmbed embed.FS

func main() {
	conf := &Config{}
	if err := envconfig.Process("", conf); err != nil {
		log.Fatalf("failed to process env vars: %v", err)
		return
	}

	// create grpc servers
	grpcServer, grpcWebServer, err := GetGrpcServers(conf.GrpcServersConfig)
	if err != nil {
		log.Fatalf("failed to start grpc servers: %v", err)
	}

	// create a file server for the web app
	buildDir, _ := fs.Sub(webStaticEmbed, "build")
	webFrontServer := FileServer(FS(buildDir))

	// create a handler that will route requests to the grpc servers or the web app
	handler := HandlerFunc(func(w ResponseWriter, r *Request) {
		switch {
		case r.ProtoMajor == 2 && strings.HasPrefix(r.Header.Get("Content-Type"), "application/grpc"):
			grpcServer.ServeHTTP(w, r)
		case grpcWebServer.IsAcceptableGrpcCorsRequest(r) || grpcWebServer.IsGrpcWebRequest(r):
			grpcWebServer.ServeHTTP(w, r)
		default:
			webFrontServer.ServeHTTP(w, r)
		}
	})

	log.Printf("starting server on %s", conf.ServingAddress)
	err = ListenAndServe(conf.ServingAddress, h2c.NewHandler(httplog.Logger(handler), &http2.Server{}))
	if err != nil {
		log.Fatalf("failed to start server: %v", err)
		return
	}
}

func getEnv(key string, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultVal
}
