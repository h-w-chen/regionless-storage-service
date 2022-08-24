package database

import (
	"fmt"
	"log"
	"os"
	"sync"

	"github.com/gomodule/redigo/redis"
	"github.com/regionless-storage-service/pkg/config"
)

var (
	pools  map[string]*redis.Pool
	doOnce sync.Once
)

func initStorageInstancePool(stores []config.KVStore) {
	pools = make(map[string]*redis.Pool)
	for _, conf := range stores {
		url, pool := initPool(conf.Host, conf.Port)
		pools[url] = pool
	}
}

func initPool(host string, port int) (string, *redis.Pool) {
	url := fmt.Sprintf("%s:%d", host, port)
	if pools[url] != nil {
		return url, pools[url]
	}
	pool := &redis.Pool{
		MaxIdle:   80,
		MaxActive: 12000,
		Dial: func() (redis.Conn, error) {
			conn, err := redis.Dial("tcp", url)
			if err != nil {
				log.Printf("ERROR: fail init redis: %s", err.Error())
				os.Exit(1)
			}
			return conn, err
		},
	}
	fmt.Printf("The url is %s and the pool is %v\n", url, pool)
	return url, pool
}

type RedisDatabase struct {
	client *redis.Pool
}

func createRedisDatabase(databaseUrl string) (Database, error) {
	doOnce.Do(func() {
		initStorageInstancePool(config.RKVConfig.Stores)
	})
	return &RedisDatabase{client: pools[databaseUrl]}, nil
}

func (rd *RedisDatabase) Put(key, value string) (string, error) {
	conn, err := rd.client.Dial()
	if err != nil {
		return "", err
	}
	defer conn.Close()
	ret, err := conn.Do("Set", key, value)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s", ret), err
}

func (rd *RedisDatabase) Get(key string) (string, error) {
	conn, err := rd.client.Dial()
	if err != nil {
		return "", err
	}
	defer conn.Close()

	if resp, err := conn.Do("Get", key); err == nil {
		return fmt.Sprintf("%s", resp), nil
	} else {
		return "", err
	}
}

func (rd *RedisDatabase) Delete(key string) error {
	conn, err := rd.client.Dial()
	if err != nil {
		return err
	}
	defer conn.Close()

	if _, err := conn.Do("Del", key); err == nil {
		return nil
	} else {
		return err
	}
}

func (rd *RedisDatabase) Close() error {
	return rd.client.Close()
}
