package config

import (
	"testing"
	"time"

	"github.com/regionless-storage-service/pkg/network/latency"
)

func TestAppend(t *testing.T) {
	var measurements latency.Measurements
	if len(measurements) != 0 {
		t.Fatalf("no measurements are expected. %d measurements now", len(measurements))
	}
	measurements.Append(latency.Sample{Success: true, Duration: 100 * time.Millisecond})
	measurements.Append(latency.Sample{Success: false, Duration: 101 * time.Millisecond})
	if len(measurements) != 2 {
		t.Fatalf("There are 2 measurements as expected. %d measurements instead", len(measurements))
	}
}

func TestAllSeconds(t *testing.T) {
	var measurements latency.Measurements

	measurements.Append(latency.Sample{Success: true, Duration: 1 * time.Nanosecond})
	measurements.Append(latency.Sample{Success: false, Duration: 2 * time.Nanosecond})

	if len(measurements.AllSeconds()) != 2 {
		t.Fatalf("There are 2 latencies as expected. %d latencies instead", len(measurements.AllSeconds()))
	}
}

func TestInsuccessCount(t *testing.T) {
	var measurements latency.Measurements

	measurements.Append(latency.Sample{Success: true, Duration: 1 * time.Nanosecond})
	measurements.Append(latency.Sample{Success: false, Duration: 2 * time.Nanosecond})

	if measurements.InsuccessCount() != 1 {
		t.Fatalf("There are 1 insuccessCount as expected. %d insuccessCount instead", measurements.InsuccessCount())
	}
	measurements.Append(latency.Sample{Success: false, Duration: 2 * time.Nanosecond})
	if measurements.InsuccessCount() != 2 {
		t.Fatalf("There are 2 insuccessCount as expected. %d insuccessCount instead", measurements.InsuccessCount())
	}
}

func TestSuccessSeconds(t *testing.T) {
	var measurements latency.Measurements

	measurements.Append(latency.Sample{Success: true, Duration: 1 * time.Nanosecond})
	measurements.Append(latency.Sample{Success: false, Duration: 2 * time.Nanosecond})

	if len(measurements.SuccessSeconds()) != 1 {
		t.Fatalf("There are 1 success latency as expected. %d latencies instead", len(measurements.AllSeconds()))
	}
	measurements.Append(latency.Sample{Success: false, Duration: 3 * time.Nanosecond})
	if len(measurements.SuccessSeconds()) != 1 {
		t.Fatalf("There are 1 success latency as expected. %d latencies instead", len(measurements.AllSeconds()))
	}
	measurements.Append(latency.Sample{Success: true, Duration: 4 * time.Nanosecond})
	if len(measurements.SuccessSeconds()) != 2 {
		t.Fatalf("There are 2 success latencies as expected. %d latencies instead", len(measurements.AllSeconds()))
	}
}
