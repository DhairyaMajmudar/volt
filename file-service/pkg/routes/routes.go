package routes

import (
	"volt/file-service/pkg/controllers"
	"volt/file-service/pkg/middlewares"

	"github.com/gorilla/mux"
)

func SetupRoutes(router *mux.Router) {
	api := router.PathPrefix("/api/v1").Subrouter()

	// Health check endpoint
	api.HandleFunc("/file-service/health", controllers.HealthCheck).Methods("GET")

	protected := api.PathPrefix("").Subrouter()
	protected.Use(middlewares.AuthMiddleware)

	// File upload and management routes
	protected.HandleFunc("/files/upload", controllers.UploadFile).Methods("POST")
	protected.HandleFunc("/files/{ID}", controllers.GetFiles).Methods("GET")
	protected.HandleFunc("/files/{ID}", controllers.DeleteFile).Methods("DELETE")
	protected.HandleFunc("/users/storage-stats", controllers.GetUserStorageStats).Methods("GET")
}
