# BiteShip 🍔🚀

A scalable production-grade food delivery platform built using microservices architecture, real-time communication, event-driven workflows, and distributed systems principles.

---

# Overview

BiteShip is a full-stack food delivery ecosystem inspired by platforms like:

- Swiggy
- Zomato
- Uber Eats

The project focuses heavily on:

- Backend engineering
- System design
- Distributed systems
- Real-time architecture
- Queue-based workflows

---

# Key Features

## Customer Features

- Google OAuth Login
- Restaurant discovery
- Geo-based restaurant search
- Cart management
- Address management
- Online payments
- Live order tracking
- Order history

---

## Seller Features

- Restaurant onboarding
- Menu management
- Restaurant availability control
- Order processing
- Real-time order updates

---

## Rider Features

- Rider onboarding
- Nearby order notifications
- Live delivery workflows
- Rider availability management
- Real-time order handling

---

## Admin Features

- Restaurant verification
- Rider verification
- Revenue analytics
- Platform monitoring

---

# Microservices Architecture

| Service | Responsibility |
|---|---|
| Auth Service | Authentication & JWT |
| Restaurant Service | Restaurants, carts, orders |
| Rider Service | Rider operations |
| Utils Service | Payments & uploads |
| Realtime Service | Socket.IO events |
| Admin Service | Verification & analytics |

---

# System Design Highlights

- Microservices Architecture
- Event-Driven Communication
- RabbitMQ Queues
- Real-Time Socket.IO Architecture
- GeoSpatial MongoDB Queries
- JWT Authentication
- Google OAuth
- Razorpay Payment Integration
- Distributed Event Processing

---

# Tech Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Socket.IO Client

---

## Backend

- Node.js
- Express.js
- TypeScript

---

## Database

- MongoDB
- Mongoose

---

## Messaging & Events

- RabbitMQ

---

## Realtime Communication

- Socket.IO

---

## Cloud & Infrastructure

- Render
- AWS EC2
- Cloudinary
- MongoDB Cloud

---

# Architecture Flow

```txt
Frontend
   │
   ▼
Microservices
   │
   ├── REST APIs
   ├── RabbitMQ Queues
   └── Socket.IO Events
```

---

# Real-Time Features

- Live rider notifications
- Order tracking
- Instant delivery updates
- Rider assignment system

---

# Event-Driven Workflows

RabbitMQ powers:

- Payment success events
- Rider assignment workflows
- Async processing

---

# GeoSpatial Features

MongoDB GeoSpatial indexes are used for:

- Nearby restaurant discovery
- Rider allocation
- Distance calculations

---

# Deployment

| Component | Platform |
|---|---|
| Backend Services | Render |
| RabbitMQ | AWS EC2 |
| Database | MongoDB Cloud |
| Media Storage | Cloudinary |

---

# Frontend Deployment Note

Frontend deployment is currently paused because of Google OAuth CORS restrictions during production deployment.

Backend services are fully deployed and functional.

---

# Project Documentation

Detailed documentation available in:

```txt
/docs
```

Includes:

- System Design
- Deployment Guide
- Realtime Architecture
- Security Architecture
- Database Design
- Order Lifecycle
- API Documentation

---

# Engineering Concepts Demonstrated

This project demonstrates:

- Production backend architecture
- Distributed systems engineering
- Queue-based communication
- Real-time systems
- Scalable database design
- Event-driven architecture
- Cloud-native deployment

---

# Future Improvements

- Kubernetes deployment
- Redis caching
- API Gateway
- CI/CD pipelines
- Monitoring dashboards
- AI-based delivery optimization

---

# Author

## Anand Kharane

Built as a production-grade backend engineering and system design project for placements and learning distributed systems architecture.