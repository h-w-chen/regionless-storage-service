package chain

import (
	"fmt"

	"github.com/regionless-storage-service/pkg/database"
)

type ChainNode struct {
	id   int
	next *ChainNode
	db   database.Database
}

func NewNode(id int, db database.Database) *ChainNode {
	return &ChainNode{id: id, db: db}
}

func (n *ChainNode) Write(key, val string) {
	fmt.Printf("***The key is %s and the value is %s\n", key, val)
	n.db.Put(key, val)
	if n.next != nil {
		n.next.Write(key, val)
	}
}

func (n *ChainNode) Read(key string) (string, error) {
	return n.db.Get(key)
}
