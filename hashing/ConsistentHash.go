package hashing

type Hasher func(s string) uint64

type ConsistentHash interface {
	GetNode(key string) Node
	AddNodes(nodes []Node)
	RemoveNodes(nodes []Node)
	NodeCount() int
}
