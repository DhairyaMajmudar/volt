# Volt - Kubernetes Deployment

This directory contains all the necessary YAML manifests to deploy the entire application stack on any Kubernetes cluster with proper scaling, security, and monitoring capabilities.

## Prerequisites

- **Kubernetes**: Version 1.20 or higher
- **kubectl**: Kubernetes CLI tool
- **K3d or Kind**: Local cluster tools

## File Structure

```
k8s/
├── namespace.yaml              # Namespace definition
├── secrets.yaml               # Secret configurations
├── configmap.yaml             # Configuration maps
├── persistent-volumes.yaml    # Storage configurations
├── database.yaml              # PostgreSQL deployment
├── db-init-configmap.yaml     # Database initialization
├── auth-service.yaml          # Authentication service
├── file-service.yaml          # File management service
├── api-gateway.yaml           # NGINX API Gateway
├── ingress.yaml               # Ingress configuration
└── README.md                 # This file
```

## Deployment Steps (Scrips)

- Create a local k8s cluster using kind or k3d
- Run k8s/deploy-k8s.sh script

```bash
# Move to k8s dir
cd k8s/

# Make script executable
chmod +x deploy-k8s.sh

# Run script (applys manifest files with appropriate time)
sh ./deploy-k8s.sh
```

## Deployment Steps (Manual)

### 1. Create kind cluster and set context with kubectl

```bash
# bash
k3d cluster create volt-cluster

# check currect kubectl context it should be k3d-volt-cluster
kubectl config current-context

# If not set to k3d-volt-cluster, set it manually
kubectl config use-context k3d-volt-cluster
```

### 2. Create Namespace

```bash
kubectl apply -f namespace.yaml
```

### 2. Setup Storage

```bash
kubectl apply -f persistent-volumes.yaml
```

### 3. Configure Secrets and ConfigMaps

```bash
kubectl apply -f secrets.yaml
kubectl apply -f configmap.yaml
kubectl apply -f db-init-configmap.yaml
```

### 4. Deploy Database

```bash
kubectl apply -f database.yaml

# Wait for database to be ready
kubectl wait --for=condition=ready pod -l app=voltdb -n volt --timeout=300s
```

### 5. Deploy Services

```bash
kubectl apply -f auth-service.yaml
kubectl apply -f file-service.yaml

# Wait for services to be ready
kubectl wait --for=condition=ready pod -l app=auth-service -n volt --timeout=300s
kubectl wait --for=condition=ready pod -l app=file-service -n volt --timeout=300s
```

### 6. Deploy Gateway and Ingress

```bash
kubectl apply -f api-gateway.yaml
kubectl apply -f ingress.yaml
```

## Useful Commands

```bash
# Quick status check
kubectl get all -n volt

# Watch pod status
kubectl get pods -n volt -w

# Get service URLs
kubectl get ingress -n volt

# Scale deployment
kubectl scale deployment auth-service --replicas=3 -n volt

# Update configuration
kubectl edit configmap volt-config -n volt
```

### Illustration

<img width="700" height="500" alt="volt-k8s-k3d" src="https://github.com/user-attachments/assets/577a0c14-6047-4e4d-9eb4-f95a7046fd6d" />


## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b new-feature`)
3. Commit your changes (`git commit -m 'feat (k8s): new feature'`)
4. Test deployment in local cluster
5. Push to the branch (`git push`)
6. Open a Pull Request
