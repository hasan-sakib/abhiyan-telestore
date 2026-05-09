# 🚀 Abiyan Telestore – Docker & Deployment Guide

A step-by-step guide to **build**, **run**, and **deploy** the entire Abiyan Telestore
application using Docker.

---

## 📁 Project Structure (deploy folder)

```
deploy/
├── .env.example            # Template for all environment variables
├── docker-compose.yml      # Orchestrates all services
├── backend.Dockerfile      # FastAPI backend image
├── frontend.Dockerfile     # Customer frontend image
├── admin.Dockerfile        # Admin panel image
└── nginx/
    ├── frontend.conf       # Nginx config for customer SPA
    └── admin.conf          # Nginx config for admin SPA
```

---

## 🏗️ Part 1 — Run Locally with Docker

### Prerequisites

| Tool             | Version  | Install Link                          |
| ---------------- | -------- | ------------------------------------- |
| Docker Desktop   | ≥ 4.x    | https://docs.docker.com/get-docker/   |
| Docker Compose   | ≥ 2.x    | Included with Docker Desktop          |

### Step 1: Create your `.env` file

```bash
cd deploy
cp .env.example .env
```

Open `deploy/.env` and fill in your real values (secret keys, Cloudinary
credentials, SMTP password, etc.).

### Step 2: Build & Start all services

```bash
# From the project root directory
docker compose -f deploy/docker-compose.yml up --build
```

This starts **4 containers**:

| Service        | Container URL              | Description             |
| -------------- | -------------------------- | ----------------------- |
| PostgreSQL     | `localhost:5432`           | Database                |
| Backend API    | `http://localhost:8000`    | FastAPI + Uvicorn       |
| Frontend       | `http://localhost:5173`    | Customer storefront     |
| Admin Panel    | `http://localhost:5174`    | Admin dashboard         |

### Step 3: Run database migrations

In a new terminal, run:

```bash
docker compose -f deploy/docker-compose.yml exec backend alembic upgrade head
```

### Step 4: Verify everything is working

```bash
# Check backend health
curl http://localhost:8000/health
# Expected: {"status":"ok"}

# Open in browser
open http://localhost:5173    # Customer frontend
open http://localhost:5174    # Admin panel
open http://localhost:8000/api/docs  # Swagger UI
```

### Useful Docker Commands

```bash
# Stop all services
docker compose -f deploy/docker-compose.yml down

# Stop and remove volumes (⚠️ deletes database data)
docker compose -f deploy/docker-compose.yml down -v

# View logs for a specific service
docker compose -f deploy/docker-compose.yml logs -f backend

# Rebuild a single service
docker compose -f deploy/docker-compose.yml up --build backend

# Open a shell inside the backend container
docker compose -f deploy/docker-compose.yml exec backend bash
```

---

## 🔄 Part 2 — CI/CD with GitHub Actions

The project includes a ready-to-use CI/CD pipeline at
`.github/workflows/ci-cd.yml`.

### What happens automatically

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Push to main   │────▶│   Run Tests      │────▶│  Build & Push    │
│  or open PR     │     │  (all 3 services)│     │  Docker Images   │
└─────────────────┘     └──────────────────┘     └──────────────────┘
                                                         │
                              ┌───────────────────────────┘
                              ▼
                    GitHub Container Registry
                    (ghcr.io/your-username/...)
```

| Trigger              | What runs                                    |
| -------------------- | -------------------------------------------- |
| **Pull Request**     | Tests only (backend pytest, frontend builds) |
| **Push to `main`**   | Tests → Build Docker images → Push to GHCR   |

### Setup (one-time)

1. Push your code to a GitHub repository.
2. Go to **Settings → Actions → General** and ensure "Read and write
   permissions" is enabled under "Workflow permissions".
3. That's it! The `GITHUB_TOKEN` is provided automatically — no extra secrets
   needed for GHCR.

---

## ☁️ Part 3 — Deploy to AWS

### Option A: AWS App Runner (Easiest)

Best for: Getting online fast with zero infrastructure management.

**Step 1: Push images to Amazon ECR**

```bash
# Login to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com

# Create repositories
aws ecr create-repository --repository-name abiyan-telestore/backend
aws ecr create-repository --repository-name abiyan-telestore/frontend
aws ecr create-repository --repository-name abiyan-telestore/admin

# Tag and push (example for backend)
docker tag abiyan-telestore-backend:latest \
  <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/abiyan-telestore/backend:latest

docker push <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/abiyan-telestore/backend:latest
```

**Step 2: Create an RDS PostgreSQL database**

```bash
aws rds create-db-instance \
  --db-instance-identifier abiyan-telestore-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 16 \
  --master-username postgres \
  --master-user-password <YOUR_PASSWORD> \
  --allocated-storage 20
```

**Step 3: Create App Runner services**

1. Go to [AWS App Runner Console](https://console.aws.amazon.com/apprunner)
2. Click **Create service**
3. Source: **Container registry → Amazon ECR**
4. Select your backend image
5. Under **Configuration**:
   - Port: `8000`
   - Add all environment variables from your `.env`
   - Set `DATABASE_URL` to point to your RDS instance
6. Repeat for frontend (port `80`) and admin (port `80`)

**Step 4: Update CORS & URLs**

Update these environment variables on your backend service:
- `FRONTEND_URL` → your frontend App Runner URL
- `ADMIN_FRONTEND_URL` → your admin App Runner URL
- `BACKEND_CORS_ORIGINS` → `["https://your-frontend-url","https://your-admin-url"]`

---

### Option B: AWS ECS + Fargate (Production-grade)

Best for: Auto-scaling, load balancing, production workloads.

**Step 1: Create an ECS Cluster**

```bash
aws ecs create-cluster --cluster-name abiyan-telestore
```

**Step 2: Create Task Definitions**

Create a JSON task definition for each service. Example for backend:

```json
{
  "family": "abiyan-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "<ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/abiyan-telestore/backend:latest",
      "portMappings": [{ "containerPort": 8000 }],
      "environment": [
        { "name": "DATABASE_URL", "value": "postgresql+psycopg://..." }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/abiyan-backend",
          "awslogs-region": "ap-south-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

**Step 3: Create Services with ALB**

```bash
# Register task definition
aws ecs register-task-definition --cli-input-json file://backend-task.json

# Create service
aws ecs create-service \
  --cluster abiyan-telestore \
  --service-name backend \
  --task-definition abiyan-backend \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

---

## ☁️ Part 4 — Deploy to Azure

### Option A: Azure App Service (Easiest)

Best for: Quick deployment with built-in SSL and custom domains.

**Step 1: Create Azure Container Registry (ACR)**

```bash
# Create resource group
az group create --name abiyan-telestore-rg --location southeastasia

# Create container registry
az acr create --resource-group abiyan-telestore-rg \
  --name abiyantelestore --sku Basic

# Login to ACR
az acr login --name abiyantelestore
```

**Step 2: Push images to ACR**

```bash
# Tag images
docker tag abiyan-telestore-backend:latest \
  abiyantelestore.azurecr.io/backend:latest

docker tag abiyan-telestore-frontend:latest \
  abiyantelestore.azurecr.io/frontend:latest

docker tag abiyan-telestore-admin:latest \
  abiyantelestore.azurecr.io/admin:latest

# Push all images
docker push abiyantelestore.azurecr.io/backend:latest
docker push abiyantelestore.azurecr.io/frontend:latest
docker push abiyantelestore.azurecr.io/admin:latest
```

**Step 3: Create Azure Database for PostgreSQL**

```bash
az postgres flexible-server create \
  --resource-group abiyan-telestore-rg \
  --name abiyan-telestore-db \
  --admin-user postgres \
  --admin-password <YOUR_PASSWORD> \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 16
```

**Step 4: Create App Services**

```bash
# Create App Service Plan
az appservice plan create \
  --name abiyan-telestore-plan \
  --resource-group abiyan-telestore-rg \
  --sku B1 --is-linux

# Create backend web app
az webapp create \
  --resource-group abiyan-telestore-rg \
  --plan abiyan-telestore-plan \
  --name abiyan-backend \
  --deployment-container-image-name abiyantelestore.azurecr.io/backend:latest

# Set environment variables
az webapp config appsettings set \
  --resource-group abiyan-telestore-rg \
  --name abiyan-backend \
  --settings \
    DATABASE_URL="postgresql+psycopg://postgres:<PASSWORD>@abiyan-telestore-db.postgres.database.azure.com:5432/abiyan_telestore" \
    SECRET_KEY="your-secret-key" \
    WEBSITES_PORT=8000

# Repeat for frontend and admin (port 80)
az webapp create \
  --resource-group abiyan-telestore-rg \
  --plan abiyan-telestore-plan \
  --name abiyan-frontend \
  --deployment-container-image-name abiyantelestore.azurecr.io/frontend:latest

az webapp create \
  --resource-group abiyan-telestore-rg \
  --plan abiyan-telestore-plan \
  --name abiyan-admin \
  --deployment-container-image-name abiyantelestore.azurecr.io/admin:latest
```

---

### Option B: Azure Container Apps (Modern & Scalable)

Best for: Microservices with auto-scaling and built-in ingress.

```bash
# Create Container Apps environment
az containerapp env create \
  --name abiyan-env \
  --resource-group abiyan-telestore-rg \
  --location southeastasia

# Deploy backend
az containerapp create \
  --name backend \
  --resource-group abiyan-telestore-rg \
  --environment abiyan-env \
  --image abiyantelestore.azurecr.io/backend:latest \
  --target-port 8000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3 \
  --registry-server abiyantelestore.azurecr.io

# Deploy frontend
az containerapp create \
  --name frontend \
  --resource-group abiyan-telestore-rg \
  --environment abiyan-env \
  --image abiyantelestore.azurecr.io/frontend:latest \
  --target-port 80 \
  --ingress external \
  --min-replicas 1

# Deploy admin
az containerapp create \
  --name admin \
  --resource-group abiyan-telestore-rg \
  --environment abiyan-env \
  --image abiyantelestore.azurecr.io/admin:latest \
  --target-port 80 \
  --ingress external \
  --min-replicas 1
```

---

## 💰 Cost Comparison

| Provider / Service        | Estimated Monthly Cost | Best For               |
| ------------------------- | ---------------------- | ---------------------- |
| **AWS App Runner**        | ~$15–30                | Quick MVPs             |
| **AWS ECS Fargate**       | ~$20–50                | Production workloads   |
| **Azure App Service B1**  | ~$13–25                | Simple deployments     |
| **Azure Container Apps**  | ~$10–30                | Scalable microservices |

> **💡 Tip:** Both AWS and Azure offer **free tiers** for new accounts that can
> cover initial development and testing costs for several months.

---

## 🔒 Security Checklist (Before Going Live)

- [ ] Change all default passwords and secret keys
- [ ] Use managed database services (RDS / Azure PostgreSQL) instead of a
      container-based database in production
- [ ] Enable HTTPS/SSL on all public endpoints
- [ ] Store secrets using AWS Secrets Manager or Azure Key Vault (not plain
      environment variables)
- [ ] Restrict `BACKEND_CORS_ORIGINS` to your actual frontend domains
- [ ] Enable database backups and point-in-time recovery
- [ ] Set up monitoring and alerting (CloudWatch / Azure Monitor)

---

## 🛠️ Troubleshooting

| Problem                          | Solution                                                           |
| -------------------------------- | ------------------------------------------------------------------ |
| Backend can't connect to DB      | Ensure `db` service is healthy: `docker compose ps`                |
| Frontend shows blank page        | Check `VITE_API_BASE_URL` build arg matches your backend URL       |
| Permission denied in container   | The backend runs as non-root user `appuser` — check file ownership |
| Port already in use              | Stop local services on ports 5432/8000/5173/5174                   |
| Images too large                 | The multi-stage builds keep images small (~150MB each)             |
