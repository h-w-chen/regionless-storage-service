package chain

import (
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

func (n *ChainNode) Write(key, val string) error {
	_, err := n.db.Put(key, val)
	if err == nil && n.next != nil {
		return n.next.Write(key, val)
	}
	return err
}

func (n *ChainNode) Read(key string) (string, error) {
	return n.db.Get(key)
}

func (n *ChainNode) Delete(key string) error {
	return n.db.Delete(key)
}

func (n *ChainNode) GetID() int {
	return n.id
}

func (n *ChainNode) GetNext() *ChainNode {
	return n.next
}
