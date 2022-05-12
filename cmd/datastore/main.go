package main

import (
	"context"
	"fmt"
	"log"
	"net"

	proto "github.com/regionless-storage-service/proto"

	"google.golang.org/grpc"
)

const (
	port = ":50051"
)

var errKeyNotFound = fmt.Errorf("key not found")

type server struct {
	data map[string]string
}

func (s *server) Set(ctx context.Context, in *proto.SetRequest) (*proto.SetReply, error) {
	key := in.GetKey()
	value := in.GetValue()
	log.Printf("serving set request for key %q and value %q", key, value)

	s.data[key] = value

	reply := &proto.SetReply{}
	return reply, nil
}

func (s *server) Get(ctx context.Context, in *proto.GetRequest) (*proto.GetReply, error) {
	key := in.GetKey()
	log.Printf("serving get request for key %q", key)

	value, ok := s.data[key]
	if !ok {
		return nil, errKeyNotFound
	}

	reply := &proto.GetReply{
		Value: value,
	}
	return reply, nil
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	log.Printf("Listening on %s", port)
	// serverInstance := server{
	// 	data: make(map[string]string),
	// }
	s := grpc.NewServer()

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
