package constants

type StoreType string

func (r StoreType) Name() string {
	return string(r)
}

const (
	Memory       StoreType = "mem"
	Redis        StoreType = "redis"
	DummyLatency StoreType = "dummy+latency"
)
