package config

import (
	"strings"
	"testing"

	"github.com/regionless-storage-service/pkg/config"
)

func TestLocalStores(t *testing.T) {
	stores := []config.KVStore{
		{
			RegionType: "local",
			Name:       "store1",
			Host:       "127.0.0.1",
			Port:       6379,
		},
		{
			RegionType: "local",
			Name:       "store2",
			Host:       "127.0.0.2",
			Port:       6379,
		},
		{
			RegionType: "local",
			Name:       "store3",
			Host:       "127.0.0.3",
			Port:       6379,
		},
		{
			RegionType: "neighbor",
			Name:       "store4",
			Host:       "172.31.9.140",
			Port:       6379,
		},
		{
			RegionType: "remote",
			Name:       "store5",
			Host:       "172.31.21.96",
			Port:       6379,
		},
		{
			RegionType: "local",
			Name:       "store6",
			Host:       "127.0.0.6",
			Port:       6379,
		},
	}
	c := &config.KVConfiguration{
		ReplicaNum: 3,
		Stores:     stores,
	}
	rs := c.GetReplications()
	if len(rs) != 4 {
		t.Fatalf("The local store number is %d", len(rs))
	}
	for _, r := range rs {
		sr := strings.Split(r, ",")
		if len(sr) != c.ReplicaNum {
			t.Fatalf("The  replication number is %d", len(sr))
		}
		if sr[0] != "127.0.0.1:6379" && sr[0] != "127.0.0.2:6379" && sr[0] != "127.0.0.3:6379" && sr[0] != "127.0.0.6:6379" {
			t.Fatalf("The local replica is %s", sr[0])
		}
		if sr[1] != "172.31.9.140:6379" {
			t.Fatalf("The neighbor replica is %s", sr[0])
		}
		if sr[2] != "172.31.21.96:6379" {
			t.Fatalf("The remote replica is %s", sr[0])
		}
	}
}

func TestNeighborStores(t *testing.T) {
	stores := []config.KVStore{
		{
			RegionType: "local",
			Name:       "store1",
			Host:       "127.0.0.1",
			Port:       6379,
		},
		{
			RegionType: "local",
			Name:       "store2",
			Host:       "127.0.0.2",
			Port:       6379,
		},
		{
			RegionType: "neighbor",
			Name:       "store3",
			Host:       "172.31.9.140",
			Port:       6379,
		},
		{
			RegionType: "neighbor",
			Name:       "store4",
			Host:       "172.31.9.141",
			Port:       6379,
		},
		{
			RegionType: "remote",
			Name:       "store5",
			Host:       "172.31.21.96",
			Port:       6379,
		},
	}
	c := &config.KVConfiguration{
		ReplicaNum: 3,
		Stores:     stores,
	}
	rs := c.GetReplications()
	if len(rs) != 2 {
		t.Fatalf("The local store number is %d", len(rs))
	}
	for _, r := range rs {
		sr := strings.Split(r, ",")
		if len(sr) != c.ReplicaNum {
			t.Fatalf("The  replication number is %d", len(sr))
		}
		if sr[0] != "127.0.0.1:6379" && sr[0] != "127.0.0.2:6379" {
			t.Fatalf("The local replica is %s", sr[0])
		}
		if sr[1] != "172.31.9.140:6379" && sr[1] != "172.31.9.141:6379" {
			t.Fatalf("The neighbor replica is %s", sr[0])
		}
		if sr[2] != "172.31.21.96:6379" {
			t.Fatalf("The remote replica is %s", sr[0])
		}
	}
}

func TestRemoteStores(t *testing.T) {
	stores := []config.KVStore{
		{
			RegionType: "local",
			Name:       "store1",
			Host:       "127.0.0.1",
			Port:       6379,
		},
		{
			RegionType: "local",
			Name:       "store2",
			Host:       "127.0.0.2",
			Port:       6379,
		},
		{
			RegionType: "neighbor",
			Name:       "store3",
			Host:       "172.31.9.140",
			Port:       6379,
		},
		{
			RegionType: "remote",
			Name:       "store4",
			Host:       "172.31.21.96",
			Port:       6379,
		},
		{
			RegionType: "remote",
			Name:       "store5",
			Host:       "172.31.21.97",
			Port:       6379,
		},
	}
	c := &config.KVConfiguration{
		ReplicaNum: 3,
		Stores:     stores,
	}
	rs := c.GetReplications()
	if len(rs) != 2 {
		t.Fatalf("The local store number is %d", len(rs))
	}
	for _, r := range rs {
		sr := strings.Split(r, ",")
		if len(sr) != c.ReplicaNum {
			t.Fatalf("The  replication number is %d", len(sr))
		}
		if sr[0] != "127.0.0.1:6379" && sr[0] != "127.0.0.2:6379" {
			t.Fatalf("The local replica is %s", sr[0])
		}
		if sr[1] != "172.31.9.140:6379" {
			t.Fatalf("The neighbor replica is %s", sr[0])
		}
		if sr[2] != "172.31.21.96:6379" && sr[2] != "172.31.21.97:6379" {
			t.Fatalf("The remote replica is %s", sr[0])
		}
	}
}
