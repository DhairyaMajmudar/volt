package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"volt/db/config"
	"volt/auth-service/pkg/middlewares"
	"volt/auth-service/pkg/routes"

	"github.com/joho/godotenv"

	"github.com/gorilla/mux"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	if err := config.InitDatabase(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer config.CloseDatabase()

	if err := config.AutoMigrate(); err != nil {
		log.Fatalf("Failed to run database migrations: %v", err)
	}

	router := mux.NewRouter()

	router.Use(middlewares.CorsMiddleware)
	router.Use(middlewares.LoggingMiddleware)

	routes.SetupRoutes(router)

	port := config.GetEnv("AUTH_PORT", "8080")

	log.Printf("Auth service starting on port %s", port)

	// Graceful shutdown
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	go func() {
		<-c
		log.Println("Shutting down auth service...")
		config.CloseDatabase()
		os.Exit(0)
	}()

	log.Fatal(http.ListenAndServe(":"+port, router))
}
