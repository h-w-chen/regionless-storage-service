package config

import (
	"testing"
	"time"

	"github.com/regionless-storage-service/pkg/network/latency"
)

func TestSummary(t *testing.T) {
	var measurements latency.Measurements

	measurements.Append(latency.Sample{Success: true, Duration: 100 * time.Nanosecond})
	measurements.Append(latency.Sample{Success: false, Duration: 200 * time.Nanosecond})
	if len(measurements) != 2 {
		t.Fatalf("There are 2 measurements as expected. %d measurements instead", len(measurements))
	}
	summary, err := measurements.Summary()
	if err != nil {
		t.Fatalf("unexpected error %v", err)
	}
	if summary.Success.Average != 100 {
		t.Fatalf("unexpected success average %d", summary.Success.Average)
	}
	measurements.Append(latency.Sample{Success: true, Duration: 200 * time.Nanosecond})
	summary, err = measurements.Summary()
	if err != nil {
		t.Fatalf("unexpected error %v", err)
	}
	if summary.Success.Average != 150 {
		t.Fatalf("unexpected success average %d", summary.Success.Average)
	}
}

func TestSummaryError(t *testing.T) {
	var measurements latency.Measurements

	measurements.Append(latency.Sample{Success: true, Duration: 100 * time.Nanosecond})
	measurements.Append(latency.Sample{Success: false, Duration: 200 * time.Nanosecond})
	measurements.Append(latency.Sample{Success: false, Duration: 200 * time.Nanosecond})

	_, err := measurements.Summary()
	if err == nil {
		t.Fatalf("error is expected since the insuccessful count is %d", measurements.InsuccessCount())
	}
}
