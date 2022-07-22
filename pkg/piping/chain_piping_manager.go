package piping

import (
	"github.com/regionless-storage-service/pkg/consistent"
	"github.com/regionless-storage-service/pkg/consistent/chain"
	"github.com/regionless-storage-service/pkg/index"
)

type ChainPiping struct {
	databaseType string
	consistency  consistent.CONSISTENCY
}

func NewChainPiping(databaseType string, consistency consistent.CONSISTENCY) *ChainPiping {
	return &ChainPiping{databaseType: databaseType, consistency: consistency}
}

func (c *ChainPiping) Read(rev index.Revision) (string, error) {
	chain, err := chain.NewChain(c.databaseType, rev.GetNodes())
	if err != nil {
		return "", err
	}
	return chain.Read(rev.String(), c.consistency)
}

func (c *ChainPiping) ReadTail(rev index.Revision) (string, error) {
	chain, err := chain.NewChain(c.databaseType, rev.GetNodes())
	if err != nil {
		return "", err
	}
	return chain.GetTail().Read(rev.String())
}

func (c *ChainPiping) Write(rev index.Revision, val string) error {
	chain, err := chain.NewChain(c.databaseType, rev.GetNodes())
	if err != nil {
		return err
	}
	chain.Write(rev.String(), val, c.consistency)
	return nil
}

func (c *ChainPiping) Delete(rev index.Revision) error {
	chain, err := chain.NewChain(c.databaseType, rev.GetNodes())
	if err != nil {
		return err
	}
	chain.Delete(rev.String(), c.consistency)
	return nil
}
