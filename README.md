# Volt 🚀

A modern, scalable cloud storage platform built with microservices architecture. Volt provides secure file management, user authentication, and a responsive web interface, designed for high availability and performance.

# Interfaces

## Overview

Volt is a full-stack cloud storage solution that combines:

- **Microservices Architecture**: Independent, scalable services
- **Modern Frontend**: React-based responsive web application
- **Secure Authentication**: JWT-based user management
- **File Management**: Advanced file storage with deduplication
- **Container-Ready**: Docker and Kubernetes deployment
- **Production-Grade**: Load balancing, monitoring, and scaling

## Architecture

## Project Structure

```
volt/
├── client/                     # React frontend application
├── auth-service/              # User authentication microservice
├── file-service/              # File management microservice
├── db/                        # Shared database models and config
├── api-gateway/               # NGINX-based API gateway
├── k8s/                       # Kubernetes deployment manifests
├── docker-compose.yml         # Local development setup
├── Dockerfile                 # Container configuration
├── Makefile                   # Build automation
├── go.work                    # Go workspace configuration
└── README.md                  # This file
```

## Components

### Frontend Application

**Tech**: React 19, TypeScript, Tailwind CSS, Vite

Modern, responsive web application providing the user interface for file management and authentication.

- **Modern React**: Built with React 19 and TypeScript
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **File Management**: file preview, and organization
- **User Experience**: Real-time updates, loading states, and error handling

[Client Docs](client/README.md)

### Authentication Service

**Tech**: Go

Handles user registration, authentication, and profile management with secure JWT token generation.

- **User Management**: Registration, login, and profile operations
- **JWT Security**: Secure token generation and validation
- **Password Security**: bcrypt encryption for password storage
- **Database Integration**: PostgreSQL with GORM ORM

[Auth Service Docs](auth-service/README.md)

### File Service

**Tech**: Go

Manages file upload, storage, retrieval, and organization with advanced features like deduplication.

- **File Operations**: Upload, delete, and organize files
- **Deduplication**: SHA-256 based file deduplication for storage optimization
- **Privacy Controls**: Public and private file visibility settings
- **Storage Analytics**: Real-time storage statistics and usage tracking

[File Service Docs](file-service/README.md)

### Database Layer

**Tech**: Go, GORM, PostgreSQL

Shared database configuration, models, and utilities used across all microservices.

- **Centralized Models**: User, File, and FileReference models
- **Database Management**: Connection pooling, migrations, and configuration

[Database Docs](db/README.md)

### API Gateway

**Tech**: NGINX

High-performance reverse proxy that routes requests to appropriate microservices.

- **Request Routing**: Intelligent routing to backend services
- **Load Balancing**: Distribute traffic across service instances
- **Security**: Rate limiting, CORS, and security headers

[API Gateway Docs](api-gateway/README.md)

### Kubernetes Deployment

**Tech**: Kubernetes, Docker

Kubernetes manifests for scalable deployment.

- **Container Orchestration**: Complete Kubernetes deployment setup
- **Development Tools**: Scripts for easy local development

[Kubernetes Docs](k8s/README.md)

## Quick Start

### Prerequisites

- **Docker & Docker Compose**: For containerized development
- **Go**: Version 1.24+ (for backend development)
- **Node.js**: Version 18+ (for frontend development)
- **PostgreSQL**: Database server
- **Kubernetes**: For production deployment (optional)

### Local Development (Docker Compose)

```bash
# Clone the repository
git clone https://github.com/dhairyaMajmudar/volt
cd volt

# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

**Access Points:**

- **Web Application**: http://localhost:5173
- **API Gateway**: http://localhost:80
- **Auth Service**: http://localhost:8080
- **File Service**: http://localhost:8081

### Manual Development Setup

#### 1. Database Setup

```bash
# Start PostgreSQL
docker run -d --name volt-postgres \
  -e POSTGRES_DB=voltdb \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 postgres:15
```

#### 2. Backend Services

```bash
# Auth Service
cd auth-service
cp .env.example .env
go mod download
go run main.go

# File Service (new terminal)
cd file-service
cp .env.example .env
go mod download
go run main.go
```

#### 3. Frontend Application

```bash
cd client
npm install
npm run dev
```

### Production Deployment (Kubernetes)

```bash
cd k8s
./scripts/deploy.sh
```

## API Documentation

### Authentication Endpoints

```
GET    /api/v1/health            # Service health check
POST   /api/v1/auth/register     # User registration
POST   /api/v1/auth/login        # User login
GET    /api/v1/auth/profile      # Get user profile
```

### File Management Endpoints

```
GET    /api/v1/file-service/health            # Service health check
POST   /api/v1/files/upload      # Upload file
GET    /api/v1/files/{userID}    # Get user files
DELETE /api/v1/files/{fileID}    # Delete file
GET    /api/v1/users/storage-stats # Storage statistics
```

## Configuration

### Environment Variables

Each service uses environment variables for configuration. Copy the `.env.example` files and customize:

```bash
# Auth Service
AUTH_PORT=8080
JWT_SECRET=your-secret-key

# File Service
FILE_PORT=8081

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=voltdb
DB_USER=postgres
DB_PASSWORD=postgres
```

### Production Configuration

For production deployment, update configuration in:

- **Kubernetes**: `k8s/configmap.yaml` and `k8s/secrets.yaml`
- **Docker Compose**: `docker-compose.prod.yml`

## Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b new-feature`)
3. Commit your changes (`git commit -m 'feat (area): new feature'`)
4. Test deployment in local cluster
5. Push to the branch (`git push`)
6. Open a Pull Request

---

<div align="center">
<b>Made with ❤️ by <a href="https://github.com/DhairyaMajmudar">DhairyaMajmudar</a>
</b>
</div>
