# Volt - Auth Service

Auth service is part of the Volt ecosystem and handles all user authentication related operations with JWT token generation and validation.

## Features

- **User Registration**: Secure user account creation with validation
- **User Authentication**: Login functionality with JWT token generation
- **Profile Management**: User profile retrieval and management
- **JWT Token Management**: Secure token generation and validation
- **Password Security**: Encrypted password storage using bcrypt
- **Database Integration**: PostgreSQL with GORM ORM
- **Health Checks**: Service health monitoring endpoint

## Prerequisites

- **Go**: Version 1.24.0 or higher
- **PostgreSQL**: Database for storing user data
- **Environment Variables**: Configuration via `.env` file

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd volt/auth-service
```

### 2. Install Dependencies

```bash
go mod download
```

### 3. Setup Environment

```bash
cp .env.example .env
```

### 4. Run the Service

```bash
go run main.go
```

### Project Structure

```
auth-service/
├── cmd/
│   └── main.go                  # Application entry point
├── pkg/
│   ├── controllers/
│   │   └── controllers.go       # HTTP request handlers (Register, Login, GetProfile, HealthCheck)
│   ├── middlewares/
│   │   └── middlewares.go       # HTTP middlewares (CORS, Logging, Auth)
│   ├── routes/
│   │   └── routes.go            # Route definitions and setup
│   └── utils/
│       └── utils.go             # JWT utilities (GenerateJWT, ValidateJWT, RefreshToken)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── go.mod                       # Go module definition
├── go.sum                       # Go module checksums
├── Dockerfile                   # Docker container definition
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b new-feature`)
3. Commit your changes (`git commit -m 'feat (auth-service): new feature'`)
4. Push to the branch (`git push`)
5. Open a Pull Request
