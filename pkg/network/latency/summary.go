package latency

import "fmt"

type distribution struct {
	Average int64
}

type summary struct {
	All     *distribution
	Success *distribution
}

func makeAverage(x []int64) (out distribution) {

	if len(x) == 0 {
		return
	}

	var sum int64
	for _, v := range x {
		sum += v
	}
	out.Average = sum / int64(len(x))
	return
}

func (m *Measurements) Summary() (summary, error) {
	all := makeAverage(m.AllSeconds())
	var out summary
	out.All = &all
	insuccessCount := m.InsuccessCount()
	if insuccessCount < 2 {
		success := makeAverage(m.SuccessSeconds())
		out.Success = &success
	} else {
		return out, fmt.Errorf("failed to connect for %d times", insuccessCount)
	}

	return out, nil
}
