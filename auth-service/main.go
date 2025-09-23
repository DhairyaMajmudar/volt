package main

import (
	"log"
	"net/http"

	"volt/auth-service/pkg/middlewares"

	"github.com/gorilla/mux"
)

func main() {

	router := mux.NewRouter()

	router.Use(middlewares.CorsMiddleware)
	router.Use(middlewares.LoggingMiddleware)

	// routes.SetupRoutes(router)

	port := "8000"

	log.Printf("Auth service starting on port %s", port)

	log.Fatal(http.ListenAndServe(":"+port, router))
}
