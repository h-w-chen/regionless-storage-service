package benchmark

import (
	"fmt"
	"testing"

	buraksezer "github.com/buraksezer/consistent"
)

func TestAddition(t *testing.T) {
	members := []buraksezer.Member{}
	for i := 0; i < 8; i++ {
		member := Member(fmt.Sprintf("node%d.olricmq", i))
		members = append(members, member)
	}
	cfg := buraksezer.Config{
		PartitionCount:    71,
		ReplicationFactor: 20,
		Load:              1.25,
		Hasher:            hasher{},
	}

	c := buraksezer.New(members, cfg)
	owners := make(map[string]int)
	for partID := 0; partID < cfg.PartitionCount; partID++ {
		owner := c.GetPartitionOwner(partID)
		owners[owner.String()]++
	}
	t.Logf("average load: %f", c.AverageLoad())
	t.Logf("owners: %v", owners)
}
