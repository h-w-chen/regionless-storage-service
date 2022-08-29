package consistent

import (
	"sort"
	"sync"
)

type RingHashing struct {
	mu        sync.RWMutex
	hasher    Hasher
	nodes     map[string]*Node
	sortedSet []uint64
	ring      map[uint64]*Node
}

func NewRingHashing(hasher Hasher) *RingHashing {

	rh := &RingHashing{
		nodes:  make(map[string]*Node),
		ring:   make(map[uint64]*Node),
		hasher: hasher,
	}

	return rh
}

func (rh *RingHashing) AddNode(node Node) {
	rh.mu.Lock()
	defer rh.mu.Unlock()

	if _, ok := rh.nodes[node.String()]; ok {
		return
	}
	rh.addNode(node)
}

func (rh *RingHashing) addNode(node Node) {
	hKey := rh.hasher.Hash([]byte(node.String()))
	rh.ring[hKey] = &node
	rh.sortedSet = append(rh.sortedSet, hKey)
	sort.Slice(rh.sortedSet, func(i int, j int) bool {
		return rh.sortedSet[i] < rh.sortedSet[j]
	})
	rh.nodes[node.String()] = &node
}

func (rh *RingHashing) LocateKey(key []byte) Node {
	partID := rh.FindPartitionID(key)
	return rh.GetPartitionOwner(partID)
}

func (rh *RingHashing) FindPartitionID(key []byte) int {
	if len(rh.nodes) == 0 {
		return -1
	}
	hkey := rh.hasher.Hash(key)
	return int(hkey % uint64(len(rh.nodes)))
}

func (rh *RingHashing) GetPartitionOwner(partID int) Node {
	rh.mu.RLock()
	defer rh.mu.RUnlock()
	if partID < 0 {
		return nil
	}
	node, ok := rh.ring[rh.sortedSet[partID]]
	if !ok {
		return nil
	}
	return *node
}

func (rh *RingHashing) GetNodes() []Node {
	rh.mu.RLock()
	defer rh.mu.RUnlock()

	nodes := make([]Node, 0, len(rh.nodes))
	for _, node := range rh.nodes {
		nodes = append(nodes, *node)
	}
	return nodes
}

func (rh *RingHashing) LocateNodes(key []byte, count int) []Node {
	if len(rh.nodes) < count {
		return nil
	}
	partID := rh.FindPartitionID(key)
	rh.mu.RLock()
	defer rh.mu.RUnlock()
	if partID < 0 {
		return nil
	}
	res := make([]Node, count)
	for i := 0; i < count; i++ {
		node, ok := rh.ring[rh.sortedSet[(partID+i)%len(rh.nodes)]]
		if !ok {
			return nil
		}
		res[i] = *node
	}

	return res
}
