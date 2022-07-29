package piping

import (
	"context"

	"github.com/regionless-storage-service/pkg/index"
)

type Piping interface {
	Read(ctx context.Context, revision index.Revision) (string, error)
	Write(ctx context.Context, rev index.Revision, val string) error
	Delete(ctx context.Context, rev index.Revision) error
}
