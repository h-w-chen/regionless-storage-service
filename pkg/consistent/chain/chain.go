package chain

import (
	"errors"
	"fmt"
	"math/rand"

	"github.com/regionless-storage-service/pkg/consistent"
	"github.com/regionless-storage-service/pkg/database"
)

type Chain struct {
	head, tail *ChainNode
	count      int
}

func NewChain(nodeType string, nodes []string) (*Chain, error) {
	if len(nodes) == 0 {
		return nil, errors.New("the number of nodes is 0")
	}
	if len(nodes) == 1 {
		return nil, errors.New("the number of nodes is 1, which means there is no replica")
	}

	dummy := NewNode(-1, nil)
	prev := dummy
	for i := 0; i < len(nodes); i++ {
		if conn, err := database.Factory(nodeType, nodes[i]); err == nil {
			curr := NewNode(i, conn)
			prev.next = curr
			prev = curr
		} else {
			fmt.Printf("The error is %v\n", err)
			return nil, err
		}
	}
	return &Chain{head: dummy.next, tail: prev, count: len(nodes)}, nil
}

func (c *Chain) Write(key, val string, consistency consistent.CONSISTENCY) {
	c.head.Write(key, val)
	if consistency == consistent.LINEARIZABLE {
		c.head.next.Write(key, val)
	} else if consistency == consistent.SEQUENTIAL {
		go c.head.next.Write(key, val)
	}

}

func (c *Chain) Read(key string, consistency consistent.CONSISTENCY) (string, error) {
	if consistency == consistent.LINEARIZABLE {
		return c.tail.Read(key)
	} else if consistency == consistent.SEQUENTIAL {
		idx := rand.Intn(c.count)
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
