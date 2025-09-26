FROM golang:1.24-alpine AS go-builder

WORKDIR /app

RUN apk add --no-cache git

COPY . .

# Build auth service
WORKDIR /app/auth-service
RUN go work sync
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o auth-service .

# Build file service
WORKDIR /app/file-service
RUN go work sync
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o file-service .

# Final stage with nginx and both services
FROM nginx:alpine

# Install supervisor to manage multiple processes
RUN apk add --no-cache supervisor

# Copy built Go binaries
COPY --from=go-builder /app/auth-service/auth-service /usr/local/bin/
COPY --from=go-builder /app/file-service/file-service /usr/local/bin/

# Copy nginx configuration from api-gateway folder
COPY api-gateway/nginx.prod.conf /etc/nginx/nginx.conf

# Copy supervisor configuration from api-gateway folder
COPY api-gateway/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create uploads directory and set permissions
RUN mkdir -p /var/uploads && chmod 755 /var/uploads

# Create log directories
RUN mkdir -p /var/log/supervisor

# Expose port 80 for the API gateway
EXPOSE 80

# Start supervisor which will manage nginx and both Go services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]