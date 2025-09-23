.PHONY: help build run clean deps test auth-service file-service stop-all

help:
	@echo "Available targets:"
	@echo "  build          - Build both services"
	@echo "  run            - Run both services"
	@echo "  auth-service   - Run only auth service"
	@echo "  file-service   - Run only file service"

# Build both services
build: build-auth build-file

build-auth:
	@echo "Building auth service..."
	cd auth-service && go build -o auth-service main.go

build-file:
	@echo "Building file service..."
	cd file-service && go build -o file-service main.go

# Run services
run: build
	@echo "Starting both services..."
	@echo "Auth service will run on port 8081"
	@echo "File service will run on port 8080"
	@echo "Press Ctrl+C to stop both services"
	cd auth-service && ./auth-service &
	cd file-service && ./file-service &
	wait

# Run individual services
auth-service: build-auth
	@echo "Starting auth service on port 8081..."
	cd auth-service && go run main.go

file-service: build-file
	@echo "Starting file service on port 8080..."
	cd file-service && go run main.go