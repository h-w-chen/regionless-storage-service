package consistent

import (
	"fmt"
	"testing"
)

func TestRendezvousAddNode(t *testing.T) {

	rdz := NewRendezvous(nil, testHash{})
	nodes := make(map[string]struct{})
	for i := 0; i < 8; i++ {
		node := testNode(fmt.Sprintf("127.0.0.1:808%d", i))
		nodes[node.String()] = struct{}{}
		rdz.AddNode(node)
	}
	for node := range nodes {
		found := false
		for _, n := range rdz.GetNodes() {
			if node == n.String() {
				found = true
			}
		}
		if !found {
			t.Fatalf("%s could not be found", node)
		}
	}
}

func TestRendezvousLocateKey(t *testing.T) {
	rdz := NewRendezvous(nil, testHash{})
	key := []byte("TestKey")
	res := rdz.LocateKey(key)
	if res != nil {
		t.Fatalf("This should be nil: %v", res)
	}
	nodes := make(map[string]struct{})
	for i := 0; i < 8; i++ {
		node := testNode(fmt.Sprintf("127.0.0.1:808%d", i))
		nodes[node.String()] = struct{}{}
		rdz.AddNode(node)
	}
	res = rdz.LocateKey(key)
	if res == nil {
		t.Fatalf("This shouldn't be nil: %v", res)
	}
}
