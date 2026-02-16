#!/bin/bash
# Quick deployment script for Todo Chatbot on Minikube
# Usage: ./deploy-minikube.sh

set -e

echo "=========================================="
echo "Todo Chatbot - Minikube Deployment"
echo "=========================================="

# Check if Minikube is running
if ! minikube status &> /dev/null; then
    echo "Error: Minikube is not running. Start it with: minikube start"
    exit 1
fi

# Check if Helm is installed
if ! command -v helm &> /dev/null; then
    echo "Error: Helm is not installed. Install from: https://helm.sh/docs/intro/install/"
    exit 1
fi

# Set Docker environment to Minikube
echo "Setting Docker environment to Minikube..."
eval $(minikube docker-env)

# Build Docker images (if Dockerfiles exist)
if [ -d "backend" ] && [ -f "backend/Dockerfile" ]; then
    echo "Building backend image..."
    docker build -t todo-chatbot-backend:latest ./backend
else
    echo "Warning: Backend Dockerfile not found. Skipping backend image build."
fi

if [ -d "frontend" ] && [ -f "frontend/Dockerfile" ]; then
    echo "Building frontend image..."
    docker build -t todo-chatbot-frontend:latest ./frontend
else
    echo "Warning: Frontend Dockerfile not found. Skipping frontend image build."
fi

# Create namespace
echo "Creating namespace..."
kubectl create namespace todo-chatbot --dry-run=client -o yaml | kubectl apply -f -

# Lint the chart
echo "Linting Helm chart..."
helm lint ./helm/todo-chatbot

# Install or upgrade the chart
echo "Deploying Todo Chatbot..."
helm upgrade --install todo-chatbot ./helm/todo-chatbot \
    -n todo-chatbot \
    -f ./helm/todo-chatbot/values-dev.yaml \
    --wait \
    --timeout 5m

# Wait for pods to be ready
echo "Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=todo-chatbot -n todo-chatbot --timeout=300s

# Display deployment status
echo ""
echo "=========================================="
echo "Deployment Status"
echo "=========================================="
kubectl get pods -n todo-chatbot
echo ""
kubectl get svc -n todo-chatbot

# Get Minikube IP and service URL
echo ""
echo "=========================================="
echo "Access Information"
echo "=========================================="
MINIKUBE_IP=$(minikube ip)
echo "Minikube IP: $MINIKUBE_IP"
echo "Frontend URL: http://$MINIKUBE_IP:30080"
echo ""
echo "Or open directly with:"
echo "  minikube service todo-chatbot-frontend -n todo-chatbot"
echo ""
echo "View logs:"
echo "  kubectl logs -n todo-chatbot -l app.kubernetes.io/name=todo-chatbot-backend -f"
echo "  kubectl logs -n todo-chatbot -l app.kubernetes.io/name=todo-chatbot-frontend -f"
echo "=========================================="
