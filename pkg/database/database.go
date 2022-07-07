package database

type Database interface {
	Put(key, value string) (string, error)
	Get(key string) (string, error)
	Delete(key string) error
	Close() error
}

type KeyValue struct {
	key             []byte
	create_revision int64
	mod_revision    int64
	version         int64
	value           []byte
}

func Factory(databaseType, databaseUrl string) (Database, error) {
	switch databaseType {
	case "redis":
		return createRedisDatabase(databaseUrl)
	default:
		return nil, &DatabaseNotImplementedError{databaseType}
	}
}
