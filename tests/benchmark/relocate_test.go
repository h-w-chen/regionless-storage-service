package benchmark

import (
	"fmt"
	"testing"

	"github.com/buraksezer/consistent"
	buraksezer "github.com/buraksezer/consistent"
)

type Member string

func (m Member) String() string {
	return string(m)
}

func TestRelocation(t *testing.T) {
	members := []buraksezer.Member{}
	for i := 0; i < 8; i++ {
		member := Member(fmt.Sprintf("node%d.olricmq", i))
		members = append(members, member)
	}
	// Modify PartitionCount, ReplicationFactor and Load to increase or decrease
	// relocation ratio.
	cfg := consistent.Config{
		PartitionCount:    271,
		ReplicationFactor: 20,
		Load:              1.25,
		Hasher:            hasher{},
	}
	c := consistent.New(members, cfg)

	// Store current layout of partitions
	owners := make(map[int]string)
	for partID := 0; partID < cfg.PartitionCount; partID++ {
		owners[partID] = c.GetPartitionOwner(partID).String()
	}

	// Add a new member
	m := Member(fmt.Sprintf("node%d.olricmq", 9))
	c.Add(m)

	// Get the new layout and compare with the previous
	var changed int
	for partID, member := range owners {
		owner := c.GetPartitionOwner(partID)
		if member != owner.String() {
			changed++
			t.Logf("partID: %3d moved to %s from %s\n", partID, owner.String(), member)
		}
	}
	t.Logf("\n%d%% of the partitions are relocated\n", (100*changed)/cfg.PartitionCount)
}
