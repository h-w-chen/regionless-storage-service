package consistent

import (
	"fmt"
	"testing"

	"github.com/cespare/xxhash"
	"github.com/regionless-storage-service/pkg/partition/consistent"
)

type testNode string

func (tn testNode) String() string {
	return string(tn)
}

type testHash struct{}

func (th testHash) Hash(key []byte) uint64 {
	return xxhash.Sum64(key)
}

func TestAddNode(t *testing.T) {

	ring := consistent.NewRingHashing(testHash{})
	nodes := make(map[string]struct{})
	for i := 0; i < 8; i++ {
		node := testNode(fmt.Sprintf("127.0.0.1:808%d", i))
		nodes[node.String()] = struct{}{}
		ring.AddNode(node)
	}
	for node := range nodes {
		found := false
		for _, n := range ring.GetNodes() {
			if node == n.String() {
				found = true
			}
		}
		if !found {
			t.Fatalf("%s could not be found", node)
		}
	}
}

func TestLocateKey(t *testing.T) {
	ring := consistent.NewRingHashing(testHash{})
	key := []byte("TestKey")
	res := ring.LocateKey(key)
	if res != nil {
		t.Fatalf("This should be nil: %v", res)
	}
	nodes := make(map[string]struct{})
	for i := 0; i < 8; i++ {
		node := testNode(fmt.Sprintf("127.0.0.1:808%d", i))
		nodes[node.String()] = struct{}{}
		ring.AddNode(node)
	}
	res = ring.LocateKey(key)
	if res == nil {
		t.Fatalf("This shouldn't be nil: %v", res)
	}
}

func TestRingLocateNodes(t *testing.T) {
	rdz := consistent.NewRingHashing(testHash{})
	key := []byte("TestKey")
	res := rdz.LocateNodes(key, 1)
	if res != nil {
		t.Fatalf("This should be nil: %v", res)
	}
	nodes := make(map[string]struct{})
	for i := 0; i < 8; i++ {
		node := testNode(fmt.Sprintf("127.0.0.1:808%d", i))
		nodes[node.String()] = struct{}{}
		rdz.AddNode(node)
	}
	res = rdz.LocateNodes(key, 1)
	if res == nil {
		t.Fatalf("This shouldn't be nil: %v", res)
	}
	if len(res) != 1 {
		t.Fatalf("This shouldn't be %d", len(res))
	}
	res = rdz.LocateNodes(key, 9)
	if res != nil {
		t.Fatalf("This should be nil: %v", res)
	}
	res = rdz.LocateNodes(key, 3)
	if len(res) != 3 {
		t.Fatalf("This shouldn't be %d", len(res))
	}
}
