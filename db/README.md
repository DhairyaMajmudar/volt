# Volt - Database Module

DB module provides database connectivity, model definitions, migrations, and shared database utilities used across all Volt microservices.

## Features

- **Centralized Database Configuration**: Single source of database setup
- **GORM Integration**: Object-relational mapping with GORM
- **PostgreSQL Support**: Optimized for PostgreSQL database
- **Auto-Migration**: Automatic database schema migrations
- **Model Definitions**: Shared data models across services
- **Connection Management**: Efficient connection pooling and management

## Prerequisites

- **Go**: Version 1.24.0 or higher
- **PostgreSQL**: Version 12 or higher
- **Environment Variables**: Database configuration

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd volt/db
```

### 2. Install Dependencies

```bash
go mod download
```

### 3. Setup Database

```bash
psql -U postgres -c "CREATE DATABASE voltdb;"
```

### Relationships

```
Users (1) ────── (N) FileReferences (N) ────── (1) Files
```

- **Users to FileReferences**: One-to-many relationship
- **Files to FileReferences**: One-to-many relationship (for deduplication)

### Project Structure

```
db/
├── config/
│   └── config.go          # Database configuration and connection
├── models/
│   ├── user.model.go      # User model definition
│   ├── file.model.go      # File model definition
├── go.mod                 # Go module dependencies
└── go.sum                 # Go module checksums
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b new-feature`)
3. Commit your changes (`git commit -m 'feat (db): new feature'`)
4. Push to the branch (`git push`)
5. Open a Pull Request

## Dependencies

- **GORM**: Object-relational mapping
- **PostgreSQL Driver**: Database connectivity
- **Crypto**: Password hashing utilities
