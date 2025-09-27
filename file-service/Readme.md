# Volt - File Service

File service is part of the Volt ecosystem and handles all file-related operations with features like deduplication, privacy controls, and storage analytics.

## Features

- **Secure File Upload**: Multi-part form upload with size limits (10MB max)
- **File Deduplication**: Automatic detection and handling of duplicate files using SHA-256 hashing
- **Privacy Controls**: Public and private file visibility settings
- **Storage Analytics**: Real-time storage statistics per user
- **JWT Authentication**: Secure authentication using JSON Web Tokens
- **File Serving**: Direct file serving with proper MIME types
- **Health Checks**: Service health monitoring endpoint

## Prerequisites

- **Go**: Version 1.24.0 or higher
- **PostgreSQL**: Database for storing file metadata
- **Environment Variables**: Configuration via `.env` file

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd volt/file-service
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
file-service/
├── main.go                 # Entry point with server setup
├── pkg/
│   ├── controllers/        # HTTP handlers
│   │   └── controllers.go  # File operations logic
│   ├── middlewares/        # HTTP middlewares
│   │   └── middlewares.go  # CORS, logging, auth
│   ├── routes/            # Route definitions
│   │   └── routes.go      # API route setup
│   └── utils/             # Utilities
│       ├── jwt.go         # JWT token handling
│       └── utils.go       # File processing utilities
├── uploads/               # File storage directory
├── .env.example          # Environment template
├── Dockerfile            # Container configuration
└── go.mod               # Go modules
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b new-feature`)
3. Commit your changes (`git commit -m 'feat (file-service): new feature'`)
4. Push to the branch (`git push`)
5. Open a Pull Request
