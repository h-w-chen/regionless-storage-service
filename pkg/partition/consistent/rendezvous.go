package consistent

type Rendezvous struct {
	nodes  map[Node]int
	nstr   []Node
	nhash  []uint64
	hasher Hasher
}

func NewRendezvous(nodes []Node, hasher Hasher) *Rendezvous {
	r := &Rendezvous{
		nodes:  make(map[Node]int, len(nodes)),
		nstr:   make([]Node, len(nodes)),
		nhash:  make([]uint64, len(nodes)),
		hasher: hasher,
	}

	for i, n := range nodes {
		r.nodes[n] = i
		r.nstr[i] = n
		r.nhash[i] = hasher.Hash([]byte(n.String()))
	}

	return r
}

func (r *Rendezvous) LocateKey(key []byte) Node {
	if len(r.nodes) == 0 {
		return nil
	}

	khash := r.hasher.Hash(key)

	var midx int
	var mhash = xorshiftMult64(khash ^ r.nhash[0])

	for i, nhash := range r.nhash[1:] {
		if h := xorshiftMult64(khash ^ nhash); h > mhash {
			midx = i + 1
			mhash = h
		}
	}

	return r.nstr[midx]
}

func (r *Rendezvous) AddNode(node Node) {
	r.nodes[node] = len(r.nstr)
	r.nstr = append(r.nstr, node)
	r.nhash = append(r.nhash, r.hasher.Hash([]byte(node.String())))
}

func (r *Rendezvous) GetNodes() []Node {
	nodes := make([]Node, 0, len(r.nstr))
	for _, node := range r.nstr {
		nodes = append(nodes, node)
	}
	return nodes
}

func xorshiftMult64(x uint64) uint64 {
	x ^= x >> 12 // a
	x ^= x << 25 // b
	x ^= x >> 27 // c
	return x * 2685821657736338717
}
