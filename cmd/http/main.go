package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"sync"

	"github.com/cespare/xxhash"
	"k8s.io/klog"

	"github.com/regionless-storage-service/pkg/config"
	"github.com/regionless-storage-service/pkg/database"
	"github.com/regionless-storage-service/pkg/index"
	"github.com/regionless-storage-service/pkg/partition/consistent"
	"github.com/regionless-storage-service/pkg/revision"
)

func main() {
	conf, err := config.NewKVConfiguration("config.json")
	if err != nil {
		panic(fmt.Errorf("error setting gateway agent configuration: %v", err))
	}
	database.InitPool(conf.Stores)

	url := flag.String("url", ":8090", "proxy url")
	flag.Parse()
	keyValueHandler := NewKeyValueHandler(conf)
	if keyValueHandler == nil {
		klog.Error("cannot run http server - http handler is null")
	} else {
		http.Handle("/kv", keyValueHandler)
		klog.Fatal(http.ListenAndServe(*url, nil))
	}
}

type KeyValueHandler struct {
	mu        sync.Mutex
	ch        consistent.ConsistentHashing
	conf      config.KVConfiguration
	indexTree index.Index
}
type testNode string

func (tn testNode) String() string {
	return string(tn)
}

type testHash struct{}

func (th testHash) Hash(key []byte) uint64 {
	return xxhash.Sum64(key)
}

type KV struct {
	key, value string
}

func NewKeyValueHandler(conf config.KVConfiguration) *KeyValueHandler {
	ring := consistent.NewRendezvous(nil, testHash{})
	for _, store := range conf.Stores {
		node := fmt.Sprintf("%s:%d", store.Host, store.Port)
		ring.AddNode(testNode(node))
	}
	return &KeyValueHandler{ch: ring, conf: conf, indexTree: index.NewTreeIndex()}
}

func (handler *KeyValueHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	handler.mu.Lock()
	defer handler.mu.Unlock()
	if r.URL.Path != "/kv" {
		http.NotFound(w, r)
		return
	}
	var result string
	var statusCode int
	var err error

	switch r.Method {
	case "GET":
		result, err = handler.getKV(w, r)
		statusCode = http.StatusAccepted
	case "POST":
		result, err = handler.createKV(w, r)
		statusCode = http.StatusCreated
	case "PUT":
		result, err = handler.createKV(w, r)
		statusCode = http.StatusCreated
	case "DELETE":
		result, err = handler.deleteKV(w, r)
		statusCode = http.StatusAccepted
	default:
		result = http.StatusText(http.StatusNotImplemented)
		statusCode = http.StatusNotImplemented
	}
	if err != nil {
		internalError := http.StatusInternalServerError
		http.Error(w, err.Error(), internalError)
	} else if result != "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(statusCode)
		w.Write([]byte(result))
	}
}

func (handler *KeyValueHandler) getKV(w http.ResponseWriter, r *http.Request) (string, error) {

	key, ok := r.URL.Query()["key"]
	if ok {
		rev, _, _, err := handler.indexTree.Get([]byte(key[0]), 0)
		if err != nil {
			return "", err
		}

		node := handler.ch.LocateKey([]byte(rev.String()))
		conn, err := database.Factory(handler.conf.StoreType, node.String())
		if err != nil {
			return "", err
		}
		ret, err := conn.Get(rev.String())
		if err != nil {
			return "", err
		}
		return fmt.Sprintf("The value is %s with the revision %s at %s\n", ret, rev.String(), node.String()), nil
	}
	return "", fmt.Errorf("the key is missing at the query %v", r.URL.Query())
}

func (handler *KeyValueHandler) createKV(w http.ResponseWriter, r *http.Request) (string, error) {
	rev := revision.GetGlobalIncreasingRevision()
	node := handler.ch.LocateKey([]byte(strconv.FormatUint(rev, 10)))
	conn, err := database.Factory(handler.conf.StoreType, node.String())
	if err != nil {
		return "", err
	}

	byteValue, err := ioutil.ReadAll(r.Body)

	if err != nil {
		klog.Errorf("Failed to read allocations with the error %v", err)
		return "", err
	}
	x := map[string]string{}
	err = json.Unmarshal(byteValue, &x)

	if err != nil {
		return "", err
	}

	_, err = conn.Put(strconv.FormatUint(rev, 10), x["value"])
	handler.indexTree.Put([]byte(x["key"]), index.NewRevision(int64(rev), 0))
	return fmt.Sprintf("The key value pair (%s,%s) has been saved as revision %s at %s\n", x["key"], x["value"], strconv.FormatUint(rev, 10), node.String()), err
}

func (handler *KeyValueHandler) deleteKV(w http.ResponseWriter, r *http.Request) (string, error) {
	key, ok := r.URL.Query()["key"]
	if ok {
		rev, _, _, err := handler.indexTree.Get([]byte(key[0]), 0)
		if err != nil {
			return "", err
		}
		//handler.indexTree.Tombstone([]byte(key[0]), rev)
		node := handler.ch.LocateKey([]byte(rev.String()))
		conn, err := database.Factory(handler.conf.StoreType, node.String())
		if err != nil {
			return "", err
		}
		err = conn.Delete(rev.String())
		return fmt.Sprintf("The key %s has been removed at %s\n", key, node.String()), err
	}
	return "", fmt.Errorf("the key is missing at the query %v", r.URL.Query())
}
