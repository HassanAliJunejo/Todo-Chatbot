# Todo Chatbot Helm Chart

Production-ready Helm chart for deploying the Todo Chatbot application on Kubernetes.

## Overview

This chart deploys a complete Todo Chatbot application consisting of:
- **Backend**: FastAPI service (Python) with 2 replicas
- **Frontend**: Next.js application with 1 replica
- **Configuration**: ConfigMaps for environment variables
- **Secrets**: Secure storage for sensitive data (DATABASE_URL, API keys, JWT secrets)

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- Minikube (for local development)
- Docker images built and available:
  - `todo-chatbot-backend:latest`
  - `todo-chatbot-frontend:latest`

## Quick Start

### 1. Install the Chart

```bash
# Create namespace
kubectl create namespace todo-chatbot

# Install with default values
helm install todo-chatbot ./helm/todo-chatbot -n todo-chatbot

# Install with custom values
helm install todo-chatbot ./helm/todo-chatbot -n todo-chatbot -f custom-values.yaml
```

### 2. Access the Application

For Minikube:
```bash
# Get Minikube IP
minikube ip

# Access frontend at http://<MINIKUBE_IP>:30080
# Or use the service command
minikube service todo-chatbot-frontend -n todo-chatbot
```

### 3. Verify Deployment

```bash
# Check pod status
kubectl get pods -n todo-chatbot

# Check services
kubectl get svc -n todo-chatbot

# View logs
kubectl logs -n todo-chatbot -l app.kubernetes.io/name=todo-chatbot-backend -f
kubectl logs -n todo-chatbot -l app.kubernetes.io/name=todo-chatbot-frontend -f
```

## Configuration

### Key Values

| Parameter | Description | Default |
|-----------|-------------|---------|
| `backend.replicaCount` | Number of backend replicas | `2` |
| `backend.image.repository` | Backend image repository | `todo-chatbot-backend` |
| `backend.image.tag` | Backend image tag | `latest` |
| `backend.service.type` | Backend service type | `ClusterIP` |
| `backend.service.port` | Backend service port | `8000` |
| `backend.resources.limits.cpu` | Backend CPU limit | `500m` |
| `backend.resources.limits.memory` | Backend memory limit | `512Mi` |
| `frontend.replicaCount` | Number of frontend replicas | `1` |
| `frontend.image.repository` | Frontend image repository | `todo-chatbot-frontend` |
| `frontend.image.tag` | Frontend image tag | `latest` |
| `frontend.service.type` | Frontend service type | `NodePort` |
| `frontend.service.port` | Frontend service port | `3000` |
| `frontend.service.nodePort` | Frontend NodePort | `30080` |

### Environment Variables

Backend environment variables are configured in `values.yaml`:
```yaml
backend:
  env:
    LOG_LEVEL: "info"
    ENVIRONMENT: "production"
  secrets:
    DATABASE_URL: "postgresql://user:password@postgres:5432/tododb"
    COHERE_API_KEY: "your-cohere-api-key-here"
    JWT_SECRET: "your-jwt-secret-here"
```

Frontend environment variables:
```yaml
frontend:
  env:
    NODE_ENV: "production"
```

## Security Considerations

**IMPORTANT**: The default `values.yaml` contains placeholder secrets for development only.

For production deployments:

1. **Never commit real secrets to version control**
2. **Use external secret management**:
   - Sealed Secrets
   - External Secrets Operator
   - HashiCorp Vault
   - Cloud provider secret managers (AWS Secrets Manager, Azure Key Vault, GCP Secret Manager)

3. **Override secrets at install time**:
```bash
helm install todo-chatbot ./helm/todo-chatbot -n todo-chatbot \
  --set backend.secrets.DATABASE_URL="postgresql://..." \
  --set backend.secrets.COHERE_API_KEY="..." \
  --set backend.secrets.JWT_SECRET="..."
```

4. **Use separate values files**:
```bash
helm install todo-chatbot ./helm/todo-chatbot -n todo-chatbot \
  -f values.yaml \
  -f secrets-production.yaml
```

## Helm Commands

### Lint the Chart
```bash
helm lint ./helm/todo-chatbot
```

### Dry Run / Template Rendering
```bash
# Render templates without installing
helm template todo-chatbot ./helm/todo-chatbot --debug

# Render with custom values
helm template todo-chatbot ./helm/todo-chatbot -f custom-values.yaml --debug
```

### Install
```bash
# Basic install
helm install todo-chatbot ./helm/todo-chatbot -n todo-chatbot --create-namespace

# Install with custom values
helm install todo-chatbot ./helm/todo-chatbot -n todo-chatbot --create-namespace -f values-production.yaml
```

### Upgrade
```bash
# Upgrade existing release
helm upgrade todo-chatbot ./helm/todo-chatbot -n todo-chatbot

# Upgrade with new values
helm upgrade todo-chatbot ./helm/todo-chatbot -n todo-chatbot -f values-production.yaml

# Upgrade or install if not exists
helm upgrade --install todo-chatbot ./helm/todo-chatbot -n todo-chatbot
```

### Rollback
```bash
# List release history
helm history todo-chatbot -n todo-chatbot

# Rollback to previous version
helm rollback todo-chatbot -n todo-chatbot

# Rollback to specific revision
helm rollback todo-chatbot 1 -n todo-chatbot
```

### Uninstall
```bash
helm uninstall todo-chatbot -n todo-chatbot
```

## Autoscaling

Horizontal Pod Autoscaling (HPA) is disabled by default. To enable:

```yaml
backend:
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 5
    targetCPUUtilizationPercentage: 70
    targetMemoryUtilizationPercentage: 80

frontend:
  autoscaling:
    enabled: true
    minReplicas: 1
    maxReplicas: 3
    targetCPUUtilizationPercentage: 75
```

## Health Checks

Both services include liveness and readiness probes:

**Backend**:
- Liveness: `GET /health` (30s initial delay)
- Readiness: `GET /health` (10s initial delay)

**Frontend**:
- Liveness: `GET /` (30s initial delay)
- Readiness: `GET /` (10s initial delay)

## Resource Management

Default resource limits:

**Backend**:
- Requests: 250m CPU, 256Mi memory
- Limits: 500m CPU, 512Mi memory

**Frontend**:
- Requests: 150m CPU, 192Mi memory
- Limits: 300m CPU, 384Mi memory

Adjust based on your workload requirements.

## Troubleshooting

### Pods not starting
```bash
# Check pod status
kubectl get pods -n todo-chatbot

# Describe pod for events
kubectl describe pod <pod-name> -n todo-chatbot

# Check logs
kubectl logs <pod-name> -n todo-chatbot
```

### Service not accessible
```bash
# Check service endpoints
kubectl get endpoints -n todo-chatbot

# Test backend health from within cluster
kubectl run curl --image=curlimages/curl -i --rm --restart=Never -- \
  curl http://todo-chatbot-backend:8000/health
```

### Image pull errors
```bash
# For Minikube, ensure images are available in Minikube's Docker daemon
eval $(minikube docker-env)
docker images | grep todo-chatbot

# Build images in Minikube context if needed
docker build -t todo-chatbot-backend:latest ./backend
docker build -t todo-chatbot-frontend:latest ./frontend
```

## Development vs Production

### Development (Minikube)
- Frontend: NodePort (30080)
- Backend: ClusterIP
- Single replicas acceptable
- Placeholder secrets OK

### Production
- Frontend: LoadBalancer or Ingress
- Backend: ClusterIP
- Multiple replicas (HA)
- External secret management required
- Resource limits tuned to workload
- Monitoring and alerting configured

## Chart Structure

```
helm/todo-chatbot/
├── Chart.yaml                      # Chart metadata
├── values.yaml                     # Default configuration values
└── templates/
    ├── _helpers.tpl                # Template helpers
    ├── backend-deployment.yaml     # Backend deployment
    ├── backend-service.yaml        # Backend service
    ├── backend-hpa.yaml            # Backend autoscaling
    ├── backend-secret.yaml         # Backend secrets
    ├── frontend-deployment.yaml    # Frontend deployment
    ├── frontend-service.yaml       # Frontend service
    ├── frontend-hpa.yaml           # Frontend autoscaling
    ├── configmap.yaml              # Shared configuration
    ├── serviceaccount.yaml         # Service account
    └── NOTES.txt                   # Post-install notes
```

## Contributing

When modifying the chart:
1. Update version in `Chart.yaml` (follow semver)
2. Run `helm lint` to validate
3. Test with `helm template` and `helm install --dry-run`
4. Update this README with any new configuration options

## License

[Your License Here]
