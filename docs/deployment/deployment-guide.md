# BiteShip Deployment Guide

# Overview

BiteShip uses a distributed deployment architecture.

Different services are deployed independently for scalability and fault isolation.

---

# Deployment Infrastructure

| Component | Platform |
|---|---|
| Frontend | Local Development |
| Backend Services | Render |
| RabbitMQ | AWS EC2 |
| Database | MongoDB Atlas |
| Media Storage | Cloudinary |

---

# Backend Services Deployment

The following services are deployed on Render:

- Auth Service
- Restaurant Service
- Rider Service
- Realtime Service
- Utils Service
- Admin Service

---

# Why Render?

Render provides:

- Easy microservice deployment
- Environment variable management
- Automatic builds
- HTTPS support
- Independent scaling

---

# RabbitMQ Deployment

RabbitMQ is deployed on AWS EC2.

---

# Why EC2 for RabbitMQ?

Reasons:
- Better control over queues
- Persistent infrastructure
- Stable queue management
- Dedicated event processing

---

# RabbitMQ Queues

```txt
PAYMENT_QUEUE
ORDER_READY_QUEUE
RIDER_QUEUE
```

---

# MongoDB Atlas

MongoDB Atlas is used as the primary cloud database.

---

# MongoDB Features Used

- GeoJSON indexing
- TTL indexes
- Aggregation pipelines
- Distributed access

---

# Cloudinary Integration

Cloudinary handles:
- Restaurant images
- Rider documents
- Menu item uploads

---

# Frontend Deployment Status

Frontend deployment was intentionally skipped in production due to Google OAuth production-origin constraints during development stage.

The frontend runs successfully in local development.

---

# Environment Variables

Each microservice maintains independent environment variables.

---

# Common Variables

```env
PORT=
MONGO_URI=
JWT_SEC=
RABBITMQ_URL=
INTERNAL_SERVICE_KEY=
```

---

# Auth Service Variables

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

# Utils Service Variables

```env
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_SECRET_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

# Realtime Service Variables

```env
JWT_SEC=
INTERNAL_SERVICE_KEY=
```

---

# Service Startup Order

Recommended startup order:

```txt
1. RabbitMQ
2. MongoDB
3. Auth Service
4. Utils Service
5. Realtime Service
6. Restaurant Service
7. Rider Service
8. Admin Service
9. Frontend
```

---

# Deployment Challenges Faced

## 1. Google OAuth Production Constraints

Issue:
- OAuth origin mismatch
- CORS restrictions
- Multi-domain authentication complexity

Solution:
- Local frontend development retained
- Backend services deployed successfully

---

# 2. RabbitMQ Connectivity

Issue:
- Cross-service communication
- Persistent queue setup

Solution:
- Dedicated EC2 RabbitMQ instance
- Durable queues configured

---

# 3. Realtime Event Synchronization

Issue:
- Socket event coordination
- Cross-service realtime updates

Solution:
- Dedicated Realtime Service
- Internal emit API architecture

---

# Security Measures

- JWT authentication
- Internal service keys
- Protected routes
- Role-based authorization

---

# Scalability Design

Services can scale independently.

Examples:
- Rider Service scales during peak delivery
- Realtime Service scales for concurrent sockets
- Payment system isolated from business logic

---

# Production Architecture Benefits

The deployment architecture provides:

- Fault isolation
- Independent deployments
- Better maintainability
- Async communication
- Scalable infrastructure

---

# Future Deployment Improvements

- Docker containerization
- Kubernetes orchestration
- CI/CD pipelines
- NGINX reverse proxy
- Redis caching
- Monitoring dashboards
- Centralized logging

---

# Deployment Summary

BiteShip demonstrates:

- Distributed systems architecture
- Event-driven workflows
- Realtime infrastructure
- Cloud deployment
- Queue-based communication
- Production-oriented backend engineering