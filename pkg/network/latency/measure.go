package latency

import (
	"time"
)

type Sample struct {
	Success  bool
	Duration time.Duration
}

type Measurements []Sample

func (m *Measurements) Append(s Sample) {
	*m = append(*m, s)
}

func (m *Measurements) InsuccessCount() (out int) {
	for _, s := range *m {
		if !s.Success {
			out++
		}
	}
	return
}
func (m *Measurements) AllSeconds() []int64 {
	out := make([]int64, len(*m))
	for i, s := range *m {
		out[i] = s.Duration.Nanoseconds()
	}

	return out
}

func (m *Measurements) SuccessSeconds() []int64 {
	out := make([]int64, 0, len(*m))
	for _, s := range *m {
		if s.Success {
			out = append(out, s.Duration.Nanoseconds())
		}
	}
	return out
}
