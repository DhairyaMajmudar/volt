FROM golang:1.24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY . .

WORKDIR /app/file-service

RUN go work sync

RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -o file-service .

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/file-service/file-service .

RUN mkdir -p /root/uploads

EXPOSE 8081

CMD ["./file-service"]