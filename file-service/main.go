package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"volt/db/config"
	"volt/file-service/pkg/middlewares"
	"volt/file-service/pkg/routes"

	"github.com/joho/godotenv"

	"github.com/gorilla/mux"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	if err := config.InitDatabase(); err != nil {
		log.Fatalf("Failed to initialize GORM database: %v", err)
	}
	defer config.CloseDatabase()

	if err := config.AutoMigrate(); err != nil {
		log.Fatalf("Failed to run GORM migrations: %v", err)
	}

	if err := os.MkdirAll("./uploads", 0755); err != nil {
		log.Fatalf("Failed to create uploads directory: %v", err)
	}

	router := mux.NewRouter()

	router.Use(middlewares.CorsMiddleware)
	router.Use(middlewares.LoggingMiddleware)

	routes.SetupRoutes(router)

	router.PathPrefix("/uploads/").Handler(http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads/"))))

	port := config.GetEnv("PORT", "8080")

	log.Printf("File management service starting on port %s", port)
	log.Printf("Upload directory: ./uploads")

	// Graceful shutdown
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	go func() {
		<-c
		log.Println("Shutting down server...")
		config.CloseDatabase()
		os.Exit(0)
	}()

	log.Fatal(http.ListenAndServe(":"+port, router))
}
