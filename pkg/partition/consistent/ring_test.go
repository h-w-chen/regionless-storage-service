package consistent

import (
	"fmt"
	"testing"

	"github.com/cespare/xxhash"
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

	ring := NewRingHashing(testHash{})
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
	ring := NewRingHashing(testHash{})
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
