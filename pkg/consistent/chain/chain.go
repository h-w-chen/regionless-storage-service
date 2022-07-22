package chain

import (
	"errors"
	"math/rand"

	"github.com/regionless-storage-service/pkg/consistent"
	"github.com/regionless-storage-service/pkg/database"
)

type Chain struct {
	head, tail *ChainNode
	len        int
}

func NewChain(nodeType string, nodes []string) (*Chain, error) {
	n := len(nodes)
	if n == 0 {
		return nil, errors.New("the number of nodes is 0")
	}
	if n == 1 {
		return nil, errors.New("the number of nodes is 1, which means there is no replica")
	}
	dbs := make([]database.Database, n)
	for i := 0; i < n; i++ {
		if db, err := database.Factory(nodeType, nodes[i]); err == nil {
			dbs[i] = db
		} else {
			return nil, err
		}
	}
	return NewChainWithDatbases(dbs), nil
}

func NewChainWithDatbases(dbs []database.Database) *Chain {
	dummy := NewNode(-1, nil)
	prev := dummy
	for i := 0; i < len(dbs); i++ {
		curr := NewNode(i, dbs[i])
		prev.next = curr
		prev = curr
	}
	return &Chain{head: dummy.next, tail: prev, len: len(dbs)}
}

func (c *Chain) Write(key, val string, consistency consistent.CONSISTENCY) error {
	if _, err := c.head.db.Put(key, val); err != nil {
		return err
	}
	//Waiting for error handling design part
	if consistency == consistent.LINEARIZABLE {
		return c.head.next.Write(key, val)
	} else if consistency == consistent.SEQUENTIAL {
		go c.head.next.Write(key, val)
	}
	return nil
}

func (c *Chain) Delete(key string, consistency consistent.CONSISTENCY) error {
	if err := c.head.db.Delete(key); err != nil {
		return err
	}
	//Waiting for error handling design part
	if consistency == consistent.LINEARIZABLE {
		return c.head.next.Delete(key)
	} else if consistency == consistent.SEQUENTIAL {
		go c.head.next.Delete(key)
	}
	return nil
}

func (c *Chain) Read(key string, consistency consistent.CONSISTENCY) (string, error) {
	if consistency == consistent.LINEARIZABLE {
		return c.tail.Read(key)
	} else if consistency == consistent.SEQUENTIAL {
		idx := rand.Intn(c.len)
		t := c.head
		for t != nil {
			if t.id == idx {
				return t.Read(key)
			}
			t = t.next
		}
	} else {
		return "", errors.New("consistency level does not implemented")
	}
	return "", errors.New("failed to read value")
}

func (c *Chain) GetHead() *ChainNode {
	return c.head
}

func (c *Chain) GetTail() *ChainNode {
	return c.tail
}

func (c *Chain) GetLen() int {
	return c.len
}
