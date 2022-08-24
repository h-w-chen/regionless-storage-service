package database

import "time"

// latentDatabase is decorator of adding specified latency to the underlying backend
type latentDatabase struct {
	backend Database
	latency time.Duration
}

func (l latentDatabase) Put(key, value string) (string, error) {
	time.Sleep(l.latency)
	return l.backend.Put(key, value)
}

func (l latentDatabase) Get(key string) (string, error) {
	time.Sleep(l.latency)
	return l.backend.Get(key)
}

func (l latentDatabase) Delete(key string) error {
	time.Sleep(l.latency)
	return l.backend.Delete(key)
}

func (l latentDatabase) Close() error {
	// not to apply latency for close op
	return l.backend.Close()
}

// newLatentDummyDatabase returns a simulated database backend which is able to apply fixed latency to CRUD ops
func newLatentDummyDatabase(latency time.Duration) Database {
	return &latentDatabase{backend: newDummyDatabase(), latency: latency}
}
