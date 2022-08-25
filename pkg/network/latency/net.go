package latency

import (
	"context"
	"net"
	"net/http/httptrace"
	"time"
)

func connectDuration(addr string) (time.Duration, error) {
	var start, end time.Time
	success := false
	trace := httptrace.ClientTrace{
		DNSDone: func(_ httptrace.DNSDoneInfo) { start = time.Now() },
		GotConn: func(_ httptrace.GotConnInfo) { end = time.Now(); success = true },
	}
	ctx := httptrace.WithClientTrace(context.Background(), &trace)
	var dialer net.Dialer
	start = time.Now()
	conn, err := dialer.DialContext(ctx, "tcp", addr)
	if !success {
		end = time.Now()
	}
	if err == nil {
		conn.Close()
	}
	return end.Sub(start), err
}
