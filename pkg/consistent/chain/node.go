package chain

import (
	"context"

	"github.com/regionless-storage-service/pkg/config"
	"github.com/regionless-storage-service/pkg/database"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/codes"
)

type ChainNode struct {
	id   int
	next *ChainNode
	db   database.Database
}

func NewNode(id int, db database.Database) *ChainNode {
	return &ChainNode{id: id, db: db}
}

func (n *ChainNode) Write(ctx context.Context, key, val string) error {
	_, rootSpan := otel.Tracer(config.TraceName).Start(ctx, "db put")
	defer rootSpan.End()
	_, err := n.db.Put(key, val)
	if err == nil && n.next != nil {
		return n.next.Write(ctx, key, val)
	} else if err != nil {
		rootSpan.RecordError(err)
		rootSpan.SetStatus(codes.Error, err.Error())
	}
	return err
}

func (n *ChainNode) Read(ctx context.Context, key string) (string, error) {
	_, rootSpan := otel.Tracer(config.TraceName).Start(ctx, "db read")
	defer rootSpan.End()
	val, err := n.db.Get(key)
	if err != nil {
		rootSpan.RecordError(err)
		rootSpan.SetStatus(codes.Error, err.Error())
		return "", err
	} else {
		return val, nil
	}
}

func (n *ChainNode) Delete(ctx context.Context, key string) error {
	_, rootSpan := otel.Tracer(config.TraceName).Start(ctx, "db delete")
	defer rootSpan.End()
	err := n.db.Delete(key)
	if err == nil && n.next != nil {
		return n.next.Delete(ctx, key)
	} else if err != nil {
		rootSpan.RecordError(err)
		rootSpan.SetStatus(codes.Error, err.Error())
	}
	return nil
}

func (n *ChainNode) GetID() int {
	return n.id
}

func (n *ChainNode) GetNext() *ChainNode {
	return n.next
}
