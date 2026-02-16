# Quick Deployment Guide - Todo Chatbot on Minikube

## Prerequisites

1. **Minikube** installed and running
   ```bash
   minikube start
   ```

2. **Helm 3** installed
   ```bash
   helm version
   ```

3. **Docker images** built (backend and frontend)

## Step-by-Step Deployment

### 1. Build Docker Images in Minikube

```bash
# Point Docker CLI to Minikube's Docker daemon
eval $(minikube docker-env)

# Build backend image
docker build -t todo-chatbot-backend:latest ./backend

# Build frontend image
docker build -t todo-chatbot-frontend:latest ./frontend

# Verify images
docker images | grep todo-chatbot
```

### 2. Validate Helm Chart

```bash
# Lint the chart
helm lint ./helm/todo-chatbot

# Dry run to see what will be deployed
helm install todo-chatbot ./helm/todo-chatbot \
  -n todo-chatbot \
  --create-namespace \
  --dry-run \
  --debug
```

### 3. Deploy to Minikube

```bash
# Create namespace
kubectl create namespace todo-chatbot

# Install with development values
helm install todo-chatbot ./helm/todo-chatbot \
  -n todo-chatbot \
  -f ./helm/todo-chatbot/values-dev.yaml

# Or use the deployment script
chmod +x ./helm/deploy-minikube.sh
./helm/deploy-minikube.sh
```

### 4. Verify Deployment

```bash
# Check pods
kubectl get pods -n todo-chatbot

# Check services
kubectl get svc -n todo-chatbot

# View backend logs
kubectl logs -n todo-chatbot -l app.kubernetes.io/name=todo-chatbot-backend -f

# View frontend logs
kubectl logs -n todo-chatbot -l app.kubernetes.io/name=todo-chatbot-frontend -f
```

### 5. Access the Application

**Option 1: Get Minikube IP**
```bash
minikube ip
# Access at: http://<MINIKUBE_IP>:30080
```

**Option 2: Use Minikube Service Command**
```bash
minikube service todo-chatbot-frontend -n todo-chatbot
```

**Option 3: Port Forward (alternative)**
```bash
kubectl port-forward svc/todo-chatbot-frontend 3000:3000 -n todo-chatbot
# Access at: http://localhost:3000
```

## Testing Backend Health

```bash
# From within the cluster
kubectl run curl --image=curlimages/curl -i --rm --restart=Never -n todo-chatbot -- \
  curl http://todo-chatbot-backend:8000/health

# Via port-forward
kubectl port-forward svc/todo-chatbot-backend 8000:8000 -n todo-chatbot
curl http://localhost:8000/health
```

## Update Deployment

```bash
# After making changes to values
helm upgrade todo-chatbot ./helm/todo-chatbot \
  -n todo-chatbot \
  -f ./helm/todo-chatbot/values-dev.yaml

# Rebuild images if code changed
eval $(minikube docker-env)
docker build -t todo-chatbot-backend:latest ./backend
docker build -t todo-chatbot-frontend:latest ./frontend

# Restart pods to use new images
kubectl rollout restart deployment/todo-chatbot-backend -n todo-chatbot
kubectl rollout restart deployment/todo-chatbot-frontend -n todo-chatbot
```

## Troubleshooting

### Pods in ImagePullBackOff
```bash
# Ensure images are built in Minikube's Docker
eval $(minikube docker-env)
docker images | grep todo-chatbot

# Check imagePullPolicy is set to Never or IfNotPresent
kubectl describe pod <pod-name> -n todo-chatbot
```

### Pods in CrashLoopBackOff
```bash
# Check logs
kubectl logs <pod-name> -n todo-chatbot

# Check events
kubectl describe pod <pod-name> -n todo-chatbot

# Common issues:
# - Missing environment variables
# - Database connection failures
# - Port conflicts
```

### Service Not Accessible
```bash
# Verify service endpoints
kubectl get endpoints -n todo-chatbot

# Check if pods are ready
kubectl get pods -n todo-chatbot

# Test connectivity
kubectl run curl --image=curlimages/curl -i --rm --restart=Never -n todo-chatbot -- \
  curl -v http://todo-chatbot-backend:8000/health
```

## Cleanup

```bash
# Uninstall the release
helm uninstall todo-chatbot -n todo-chatbot

# Delete namespace
kubectl delete namespace todo-chatbot

# Stop Minikube (optional)
minikube stop
```

## Configuration Overrides

### Custom Database URL
```bash
helm install todo-chatbot ./helm/todo-chatbot \
  -n todo-chatbot \
  --set backend.secrets.DATABASE_URL="postgresql://user:pass@host:5432/db"
```

### Custom Replica Counts
```bash
helm install todo-chatbot ./helm/todo-chatbot \
  -n todo-chatbot \
  --set backend.replicaCount=3 \
  --set frontend.replicaCount=2
```

### Custom Image Tags
```bash
helm install todo-chatbot ./helm/todo-chatbot \
  -n todo-chatbot \
  --set backend.image.tag="v1.2.3" \
  --set frontend.image.tag="v1.2.3"
```

## Next Steps

1. Set up proper secrets management (Sealed Secrets, External Secrets Operator)
2. Configure Ingress for external access (instead of NodePort)
3. Set up monitoring with Prometheus and Grafana
4. Configure persistent storage for database
5. Implement CI/CD pipeline for automated deployments
