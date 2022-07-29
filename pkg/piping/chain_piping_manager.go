package piping

import (
	"context"

	"github.com/regionless-storage-service/pkg/config"
	"github.com/regionless-storage-service/pkg/consistent"
	"github.com/regionless-storage-service/pkg/consistent/chain"
	"github.com/regionless-storage-service/pkg/index"
	"go.opentelemetry.io/otel"
)

type ChainPiping struct {
	databaseType string
	consistency  consistent.CONSISTENCY
}

func NewChainPiping(databaseType string, consistency consistent.CONSISTENCY) *ChainPiping {
	return &ChainPiping{databaseType: databaseType, consistency: consistency}
}

func (c *ChainPiping) Read(ctx context.Context, rev index.Revision) (string, error) {
	chain, err := chain.NewChain(ctx, c.databaseType, rev.GetNodes())
	if err != nil {
		return "", err
	}
	_, rootSpan := otel.Tracer(config.TraceName).Start(ctx, "chain read")
	defer rootSpan.End()
	return chain.Read(rev.String(), c.consistency)
}

func (c *ChainPiping) ReadTail(ctx context.Context, rev index.Revision) (string, error) {
	chain, err := chain.NewChain(ctx, c.databaseType, rev.GetNodes())
	if err != nil {
		return "", err
	}
	_, rootSpan := otel.Tracer(config.TraceName).Start(ctx, "chain read tail")
	defer rootSpan.End()
	return chain.GetTail().Read(ctx, rev.String())
}

func (c *ChainPiping) Write(ctx context.Context, rev index.Revision, val string) error {

	chain, err := chain.NewChain(ctx, c.databaseType, rev.GetNodes())
	if err != nil {
		return err
	}
	_, rootSpan := otel.Tracer(config.TraceName).Start(ctx, "chain write")
	defer rootSpan.End()
	chain.Write(rev.String(), val, c.consistency)
	return nil
}

func (c *ChainPiping) Delete(ctx context.Context, rev index.Revision) error {
	chain, err := chain.NewChain(ctx, c.databaseType, rev.GetNodes())
	if err != nil {
		return err
	}
	_, rootSpan := otel.Tracer(config.TraceName).Start(ctx, "chain delete")
	defer rootSpan.End()
	chain.Delete(rev.String(), c.consistency)
	return nil
}
