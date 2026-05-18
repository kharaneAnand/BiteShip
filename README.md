# BiteShip 🍔⚡

BiteShip is a distributed real-time food delivery platform built using a microservices architecture.

The platform supports:
- Customer food ordering
- Restaurant onboarding
- Rider delivery workflows
- Real-time order tracking
- Online payments
- Event-driven communication
- Admin verification system

---

# 🚀 System Architecture

BiteShip follows a microservices-based distributed architecture.

## Services

| Service | Responsibility |
|---|---|
| Auth Service | Authentication & JWT |
| Restaurant Service | Restaurants, Menu, Cart, Orders |
| Rider Service | Rider workflows & delivery lifecycle |
| Realtime Service | Socket.IO realtime communication |
| Utils Service | Cloudinary uploads & payment handling |
| Admin Service | Verification & monitoring |

---

# ⚙️ Tech Stack

## Frontend
- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Socket.IO Client

## Backend
- Node.js
- Express.js
- TypeScript

## Database
- MongoDB Atlas

## Realtime & Messaging
- Socket.IO
- RabbitMQ

## Cloud & Infrastructure
- Render
- AWS EC2
- Cloudinary

## Payments
- Razorpay
- Stripe

---

# 🔥 Core Features

# Customer Features
- Google Authentication
- Nearby restaurant discovery
- Search restaurants
- Cart management
- Address management
- Online payment
- Real-time order tracking
- Order history

# Restaurant Features
- Restaurant onboarding
- Menu management
- Order lifecycle management
- Realtime order updates

# Rider Features
- Rider onboarding
- Live delivery requests
- Delivery lifecycle tracking
- Realtime map tracking

# Admin Features
- Restaurant verification
- Rider verification
- Analytics dashboard

---

# 🧠 System Design Highlights

## Microservices Architecture
Each domain is isolated into independent deployable services.

## Event-Driven Communication
RabbitMQ queues handle:
- Payment success events
- Rider assignment workflows
- Order ready notifications

## Realtime Infrastructure
Socket.IO enables:
- Live rider updates
- Live order tracking
- Instant notifications

## GeoSpatial Queries
MongoDB GeoJSON indexes are used for:
- Nearby restaurant discovery
- Rider matching

---

# 🌐 Deployment

## Backend Services
Deployed on Render:
- Auth Service
- Restaurant Service
- Rider Service
- Realtime Service
- Utils Service
- Admin Service

## Queue Infrastructure
RabbitMQ deployed on AWS EC2.

## Media Storage
Cloudinary CDN used for image storage.

## Frontend Deployment
Frontend deployment was intentionally skipped in production due to Google OAuth production-origin constraints during development stage.

---

# 🔄 RabbitMQ Queues

```txt
PAYMENT_QUEUE
ORDER_READY_QUEUE
RIDER_QUEUE
```

---

# 📦 Project Structure

```txt
BiteShip/
│
├── frontend/
│
├── services/
│   ├── auth-service/
│   ├── restaurant-service/
│   ├── rider-service/
│   ├── realtime-service/
│   ├── utils-service/
│   └── admin-service/
│
├── docs/
│
└── README.md
```

---

# 🔐 Authentication

- Google OAuth
- JWT-based authorization
- Role-based access control

Supported roles:
- Customer
- Seller
- Rider
- Admin

---

# 📡 Realtime Workflow

1. Restaurant marks order ready
2. RabbitMQ publishes event
3. Rider service consumes event
4. Nearby riders detected
5. Socket.IO emits realtime request
6. Rider accepts order
7. Customer receives live updates

---

# 📈 Future Improvements

- Kubernetes deployment
- Docker containerization
- Redis caching
- CI/CD pipelines
- Push notifications
- AI-based rider allocation

---

# 👨‍💻 Author

Anand Kharane  
IIT Jodhpur