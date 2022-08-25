package database

var (
	// Storages keeps all backend storages indexed by name
	Storages map[string]Database = make(map[string]Database)
)

type Database interface {
	Put(key, value string) (string, error)
	Get(key string) (string, error)
	Delete(key string) error
	Close() error
}

func Factory(databaseType, databaseUrl string) (Database, error) {
	switch databaseType {
	case "redis":
		return createRedisDatabase(databaseUrl)
	case "mem":
		return NewMemDatabase(databaseUrl), nil
	default:
		return nil, &DatabaseNotImplementedError{databaseType}
	}
}
