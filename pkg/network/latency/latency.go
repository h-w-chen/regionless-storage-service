package latency

import (
	"sync"
)

type output struct {
	Measurements Measurements
	Summary      summary
}

func GetLatency(target string, count int) (output, error) {
	var out output
	var mu sync.Mutex
	var wg sync.WaitGroup

	for i := 0; i < count; i++ {
		wg.Add(1)
		go worker(&wg, &mu, target, &out)
	}
	wg.Wait()
	if summary, err := out.Measurements.Summary(); err == nil {
		out.Summary = summary
		return out, nil
	} else {
		return out, err
	}
}

func worker(wg *sync.WaitGroup, mu *sync.Mutex, target string, out *output) {
	defer wg.Done()

	d, err := connectDuration(target)
	sample := Sample{
		Success:  err == nil,
		Duration: d,
	}
	mu.Lock()
	out.Measurements.Append(sample)
	mu.Unlock()
}
