package chain

import (
	"context"
	"testing"
	"time"

	"github.com/regionless-storage-service/pkg/consistent"
	"github.com/regionless-storage-service/pkg/consistent/chain"
	"github.com/regionless-storage-service/pkg/database"
	"github.com/regionless-storage-service/test/mock"
)

func TestNewChainWithDatabases(t *testing.T) {
	dbs := make([]database.Database, 5)
	for i := 0; i < len(dbs); i++ {
		dbs[i] = mock.NewMockDatabase()
	}
	chain := chain.NewChainWithDatbases(context.TODO(), dbs)
	if chain.GetHead() == nil {
		t.Fatal("head is empty")
	}
	if chain.GetHead().GetID() != 0 {
		t.Fatalf("head %d is not 0", chain.GetHead().GetID())
	}
	if chain.GetTail() == nil {
		t.Fatal("tail is empty")
	}
	if chain.GetTail().GetID() != len(dbs)-1 {
		t.Fatalf("tail %d is not %d", chain.GetTail().GetID(), len(dbs)-1)
	}
	if chain.GetTail().GetNext() != nil {
		t.Fatalf("tail %d has pointed to another node", chain.GetTail().GetID())
	}
	p := chain.GetHead()
	for i := 0; i < len(dbs); i++ {
		if p == nil {
			t.Fatal("empty node not expected")
		}
		if p.GetID() != i {
			t.Fatalf("node %d has a different id %d", i, p.GetID())
		}
		p = p.GetNext()
	}
}

func TestChainWriteLINEARIZABLE(t *testing.T) {
	dbs := make([]database.Database, 5)
	for i := 0; i < len(dbs); i++ {
		dbs[i] = mock.NewMockDatabase()
	}
	chain := chain.NewChainWithDatbases(context.TODO(), dbs)
	chain.Write("k1", "v1", consistent.LINEARIZABLE)
	if v1, err := chain.GetTail().Read(context.TODO(), "k1"); err != nil {
		t.Fatalf("tail failed to read  with error %v", err)
	} else if v1 != "v1" {
		t.Fatalf("tail failed to read a correct value %s", v1)
	}
}

func TestChainWriteSEQUENTIAL(t *testing.T) {
	dbs := make([]database.Database, 2)
	for i := 0; i < len(dbs); i++ {
		dbs[i] = mock.NewMockDatabaseWithLatency(0, 5)
	}
	chain := chain.NewChainWithDatbases(context.TODO(), dbs)
	chain.Write("k1", "v1", consistent.SEQUENTIAL)
	if _, err := chain.GetTail().Read(context.TODO(), "k1"); err == nil {
		t.Fatalf("tail failed is supposed not to find the key")
	}
	time.Sleep(10 * time.Second)
	if v1, err := chain.GetTail().Read(context.TODO(), "k1"); err != nil {
		t.Fatalf("tail failed to read  with error %v", err)
	} else if v1 != "v1" {
		t.Fatalf("tail failed to read a correct value %s", v1)
	}
}
