# User Microservices (EKS Practice Ready)

This repo contains three microservices and a modern React frontend for a simple user creation and management flow with notifications using AWS SES and/or SNS.

## Services
1. **user-create-service** — Creates users and triggers notifications
2. **user-management-service** — CRUD operations for users
3. **notification-service** — Sends notifications via SES (email) and optionally SNS

## Frontend
- **frontend/** — React (Vite + Bootstrap) app with styled UI to create and manage users.

## Database
- PostgreSQL with one table `users`. See `db/init.sql` for schema.

## Quick Start (Local with Docker Compose)
> Requires Docker and Docker Compose.
```bash
cp .env.example .env
# Edit .env with your values (DB password, optional AWS creds)
docker compose up --build
```

The stack will run at:
- Frontend: http://localhost:5173
- Create API: http://localhost:3000
- Manage API: http://localhost:3001
- Notification API: http://localhost:3002
- Postgres: localhost:5432

> The frontend reads API URLs from environment variables at build time. When using `docker compose`, they are already set.

## Environment Variables
See `.env.example`. Minimum required to run locally:
- DB_HOST, DB_USER, DB_PASS, DB_NAME
- NOTIFY_URL (notification service URL for the create service)
- For SES/SNS, set: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, SENDER_EMAIL, and optionally SNS_TOPIC_ARN

If SES/SNS are not configured, `notification-service` will log the notification (DRY_RUN mode).

## Kubernetes/EKS
This code is EKS-ready. Build images, push to ECR, and create Deployments/Services/Ingress. You can wire the three services behind an ALB and configure security via Secrets for credentials.

## License
MIT
