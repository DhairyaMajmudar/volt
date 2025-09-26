package routes

import (
	"volt/auth-service/pkg/controllers"
	"volt/auth-service/pkg/middlewares"

	"github.com/gorilla/mux"
)

func SetupRoutes(router *mux.Router) {
	api := router.PathPrefix("/api/v1").Subrouter()

	// Public routes
	api.HandleFunc("/health", controllers.HealthCheck).Methods("GET")
	api.HandleFunc("/auth/register", controllers.Register).Methods("POST")
	api.HandleFunc("/auth/login", controllers.Login).Methods("POST")

	// Protected routes
	protected := api.PathPrefix("").Subrouter()
	protected.Use(middlewares.AuthMiddleware)

	protected.HandleFunc("/auth/profile", controllers.GetProfile).Methods("GET")
}
