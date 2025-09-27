# Volt - API Gateway

This api gateway handles request routing, load balancing, rate limiting, CORS, and SSL termination for all backend microservices.

## Features

- **Request Routing**: Intelligent routing to auth-service and file-service
- **Load Balancing**: Distribute requests across multiple service instances
- **Rate Limiting**: Protect backend services from abuse and overload
- **CORS Support**: Cross-origin resource sharing for web applications
- **SSL/TLS Termination**: Handle HTTPS encryption at the gateway level
- **Health Checks**: Monitor backend service availability
- **Request/Response Logging**: Comprehensive access and error logging
- **Static File Serving**: Serve client application assets
- **WebSocket Support**: Proxy WebSocket connections to backend services
- **Security Headers**: Add security headers to all responses

## Prerequisites

- **NGINX**: Version 1.20 or higher
- **Docker**: For containerized deployment
- **Backend Services**: Auth and File services must be running and building

## File Structure

```
api-gateway/
├── nginx.conf                  # Main NGINX configuration
├── nginx.prod.conf            # Production-optimized configuration
├── supervisord.conf           # Process management configuration
├── Dockerfile                 # Container configuration
└── README.md                  # This file
```

## Security Features

### Rate Limiting

```nginx
# Configure rate limiting zones
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

# Apply rate limits
location /api/v1/auth/login {
    limit_req zone=auth burst=3 nodelay;
    proxy_pass http://auth_service/api/v1/auth/login;
}
```

## Development Setup

### Local Development

```bash
# Start with Docker Compose
docker-compose up -d

# Or run NGINX directly
nginx -c /path/to/nginx.conf -g "daemon off;"
```

### Health Checks

```bash
# Gateway health check
curl -I http://localhost/health

# Auth service health via gateway
curl http://localhost/api/v1/health

# File service health via gateway
curl http://localhost/api/v1/file-service/health
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b new-feature`)
3. Commit your changes (`git commit -m 'feat (api-gateway): new feature'`)
4. Push to the branch (`git push`)
5. Open a Pull Request
