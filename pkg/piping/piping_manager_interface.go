package piping

import (
	"github.com/regionless-storage-service/pkg/index"
)

type Piping interface {
	Read(revision index.Revision) (string, error)
	Write(rev index.Revision, val string) error
}
