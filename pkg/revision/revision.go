package revision

import "sync/atomic"

var global_increasing_revision uint64

func GetGlobalIncreasingRevision() uint64 {
	atomic.AddUint64(&global_increasing_revision, 1)
	return global_increasing_revision
}
