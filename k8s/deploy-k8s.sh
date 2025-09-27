#!/bin/bash

set -e

# Create Namespace
kubectl apply -f namespace.yaml

# Setup Storage
kubectl apply -f persistent-volumes.yaml

# Create Secrets and ConfigMaps
kubectl apply -f secrets.yaml
kubectl apply -f configmap.yaml
kubectl apply -f db-init-configmap.yaml

# Deploy Database
kubectl apply -f database.yaml

# Wait for database to be ready
kubectl wait --for=condition=ready pod -l app=voltdb -n volt --timeout=300s

# Deploy Services

kubectl apply -f auth-service.yaml
kubectl apply -f file-service.yaml

# Wait for services to be ready
kubectl wait --for=condition=ready pod -l app=auth-service -n volt --timeout=300s
kubectl wait --for=condition=ready pod -l app=file-service -n volt --timeout=300s

# Deploy Gateway and Ingress

kubectl apply -f api-gateway.yaml
kubectl apply -f ingress.yaml