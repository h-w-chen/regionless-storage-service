# regionless-storage-service
Consistent hashing with bounded loads

Configuration
-------------
```go
type Config struct {
	// Hasher is responsible for generating unsigned, 64 bit hash of provided byte slice.
	Hasher Hasher
	// Keys are distributed among partitions. Prime numbers are good to
	// distribute keys uniformly. Select a big PartitionCount if you have
	// too many keys.
	PartitionCount int
	// Members are replicated on consistent hash ring. This number controls
	// the number each member is replicated on the ring.
	ReplicationFactor int
	// Load is used to calculate average load. See the code, the paper and Google's 
	// blog post to learn about it.
	Load float64
}
```
Any hash algorithm can be used as hasher which implements Hasher interface. Please take a look at the *Sample* section for an example.

Usage
-----
`LocateKey` function finds a member in the cluster for your key:
```go
// With a properly configured and initialized consistent instance
key := []byte("my-key")
member := c.LocateKey(key)
```
It returns a thread-safe copy of the member you added before.
The second most frequently used function is `GetClosestNode`. 
```go
// With a properly configured and initialized consistent instance
key := []byte("my-key")
members, err := c.GetClosestNode(key, 2)
```
This may be useful to find backup nodes to store your key.
Benchmarks
----------
```
LocateKey       252 ns
GetClosestNode  2974 ns
```
Examples
--------
The most basic use of consistent package should be like this. For detailed list of functions, [visit godoc.org.](https://godoc.org/github.com/buraksezer/consistent)
More sample code can be found under [_examples](https://github.com/buraksezer/consistent/tree/master/_examples).
```go
type Node string
func (node Node) String() string {
	return string(node)
}

type hasher struct{}
func (h hasher) Sum64(data []byte) uint64 {
	return hash.Sum64(data)
}

func main() {
	// Create a new consistent instance
	cfg := consistent.Config{
		PartitionCount:    7,
		ReplicationFactor: 20,
		Load:              1.25,
		Hasher:            hasher{},
	}
	c := consistent.New(nil, cfg)
	node1 := Node("172.10.0.1")
	c.Add(node1)
	node2 := Node("172.10.0.2")
	c.Add(node2)
	key := []byte("my-key")
	fmt.Println(owner.String())
}
```
TBD
Move partition count 

Average load can be calculated by using the following formula:
```
load := (consistent.AverageLoad() * float64(keyCount)) / float64(config.PartitionCount)
```
