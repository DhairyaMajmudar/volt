FROM golang:1.24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY . .

WORKDIR /app/auth-service

RUN go work sync

RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -o auth-service .

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/auth-service/auth-service .

EXPOSE 8080

CMD ["./auth-service"]