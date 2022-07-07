package benchmark

import (
	"crypto/rand"
	"fmt"
	"math"
	"testing"

	buraksezer "github.com/buraksezer/consistent"
)

func TestLoad(t *testing.T) {
	members := []buraksezer.Member{}
	for i := 0; i < 8; i++ {
		member := Member(fmt.Sprintf("node%d.olricmq", i))
		members = append(members, member)
	}
	cfg := buraksezer.Config{
		PartitionCount:    271,
		ReplicationFactor: 40,
		Load:              1.2,
		Hasher:            hasher{},
	}
	c := buraksezer.New(members, cfg)

	keyCount := 1000000
	load := (c.AverageLoad() * float64(keyCount)) / float64(cfg.PartitionCount)
	t.Log("Maximum key count for a member should be around this: ", math.Ceil(load))
	distribution := make(map[string]int)
	key := make([]byte, 4)
	for i := 0; i < keyCount; i++ {
		rand.Read(key)
		member := c.LocateKey(key)
		distribution[member.String()]++
	}
	for member, count := range distribution {
		t.Logf("member: %s, key count: %d\n", member, count)
	}
}
