package main

import (
	"flag"
	"fmt"
	"net/http"
	"strings"
)

type Node struct {
	Url string
}

type Server struct {
	nodes []Node
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {

}

func main() {
	port := flag.Int("port", 1000, "Port for the key value")
	members := flag.String("membmers", "", "Members of the sharded key value store instances")
	nodes := make([]Node, 0)
	for _, member := range strings.Split(*members, ",") {
		nodes = append(nodes, Node{member})
	}

	command := flag.Arg(0)

	server := &Server{
		nodes: nodes,
	}

	if command == "server" {
		http.ListenAndServe(fmt.Sprintf(":%d", *port), server)
	}
}
