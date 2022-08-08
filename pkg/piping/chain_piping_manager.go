package piping

import (
	"context"
	"sync"

	"github.com/regionless-storage-service/pkg/config"
	"github.com/regionless-storage-service/pkg/consistent"
	"github.com/regionless-storage-service/pkg/consistent/chain"
	"github.com/regionless-storage-service/pkg/index"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/codes"
)

type ChainPiping struct {
	databaseType string
	consistency  consistent.CONSISTENCY
	concurrent   bool
}

func NewChainPiping(databaseType string, consistency consistent.CONSISTENCY, concurrent bool) *ChainPiping {
	return &ChainPiping{databaseType: databaseType, consistency: consistency, concurrent: concurrent}
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
	nodeChains, err := chain.NewChain(ctx, c.databaseType, rev.GetNodes())
	if err != nil {
		return err
	}
	_, rootSpan := otel.Tracer(config.TraceName).Start(ctx, "chain write")
	defer rootSpan.End()
	if c.concurrent {
		var wg sync.WaitGroup
		p := nodeChains.GetHead()
		for p != nil {
			wg.Add(1)
			go func(ctx context.Context, node *chain.ChainNode, key, val string) {
				defer wg.Done()
				_, rootSpan := otel.Tracer(config.TraceName).Start(ctx, "db put")
				defer rootSpan.End()
				if _, err := node.GetDB().Put(key, val); err != nil {
					rootSpan.RecordError(err)
					rootSpan.SetStatus(codes.Error, err.Error())
				}
			}(ctx, p, rev.String(), val)
			p = p.GetNext()
		}
		wg.Wait()
	} else {
		nodeChains.Write(rev.String(), val, c.consistency)
	}
	return nil
}

func (c *ChainPiping) Delete(ctx context.Context, rev index.Revision) error {
	nodeChains, err := chain.NewChain(ctx, c.databaseType, rev.GetNodes())
	if err != nil {
		return err
	}
	_, rootSpan := otel.Tracer(config.TraceName).Start(ctx, "chain delete")
	defer rootSpan.End()
	if c.concurrent {
		var wg sync.WaitGroup
		p := nodeChains.GetHead()
		for p != nil {
			wg.Add(1)
			go func(ctx context.Context, node *chain.ChainNode, key string) {
				defer wg.Done()
				_, rootSpan := otel.Tracer(config.TraceName).Start(ctx, "db delete")
				defer rootSpan.End()
				if err := node.GetDB().Delete(key); err != nil {
					rootSpan.RecordError(err)
					rootSpan.SetStatus(codes.Error, err.Error())
				}
			}(ctx, p, rev.String())
			p = p.GetNext()
		}
		wg.Wait()
	} else {
		nodeChains.Delete(rev.String(), c.consistency)
	}
	return nil
}
