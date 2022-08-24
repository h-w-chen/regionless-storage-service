package database

import (
	"fmt"
	"github.com/regionless-storage-service/pkg/config"
	"time"
)

var (
	// all backend storages by their names
	Storages map[string]Database = make(map[string]Database)
)

type Database interface {
	Put(key, value string) (string, error)
	Get(key string) (string, error)
	Delete(key string) error
	Close() error
}

func Factory(databaseType string, storeConfig *config.KVStore) (Database, error) {
	switch databaseType {
	case "redis":
		databaseUrl := fmt.Sprintf("%s:%d", storeConfig.Host, storeConfig.Port)
		return createRedisDatabase(databaseUrl)
	case "mem":
		// todo: this url does not make much sense for mem db; need to fix
		databaseUrl := fmt.Sprintf("%s:%d", storeConfig.Host, storeConfig.Port)
		return NewMemDatabase(databaseUrl), nil
	case "latency+dummy":
		return newLatentDummyDatabase(time.Millisecond * time.Duration(storeConfig.ArtificialLatencyMs)), nil
	default:
		return nil, &DatabaseNotImplementedError{databaseType}
	}
}
