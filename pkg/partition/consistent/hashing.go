package consistent

type Hasher interface {
	Hash([]byte) uint64
}

type Node interface {
	String() string
}

type ConsistentHashing interface {
	AddNode(node Node)
	LocateKey(key []byte) Node
}
