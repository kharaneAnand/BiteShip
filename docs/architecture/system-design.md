# BiteShip Microservices Communication

# Overview

BiteShip uses a distributed microservices architecture where services communicate using:

- REST APIs
- RabbitMQ event queues
- Socket.IO realtime communication

---

# Architecture Style

The platform follows:

- Domain-driven microservices
- Event-driven communication
- Realtime socket-based updates

---

# Service Communication Map

```txt
Frontend
   │
   ├── Auth Service
   ├── Restaurant Service
   ├── Rider Service
   ├── Admin Service
   ├── Realtime Service
   └── Utils Service
```

---

# Communication Types

# 1. REST APIs

Used for:
- CRUD operations
- Authentication
- Fetching data
- Updating resources

## Examples

### Frontend → Auth Service
```txt
POST /api/auth/login
GET /api/auth/me
```

### Frontend → Restaurant Service
```txt
GET /api/restaurant/all
POST /api/cart/add
POST /api/order/new
```

### Frontend → Rider Service
```txt
POST /api/rider/accept/:orderId
PUT /api/rider/order/update/:orderId
```

---

# 2. RabbitMQ Event Communication

RabbitMQ enables asynchronous workflows between services.

---

# PAYMENT_QUEUE

## Producer
Utils Service

## Consumer
Restaurant Service

## Purpose
Updates order payment status after successful payment verification.

---

# ORDER_READY_QUEUE

## Producer
Restaurant Service

## Consumer
Rider Service

## Purpose
Notifies nearby riders when an order becomes ready for pickup.

---

# RIDER_QUEUE

## Producer
Rider Service

## Consumer
Restaurant Service

## Purpose
Handles rider assignment and delivery workflows.

---

# Event Flow Example

## Payment Flow

```txt
Customer Pays
      │
      ▼
Utils Service verifies payment
      │
      ▼
PAYMENT_QUEUE
      │
      ▼
Restaurant Service consumes event
      │
      ▼
Order marked as PAID
```

---

# Rider Assignment Flow

```txt
Restaurant marks order ready
        │
        ▼
ORDER_READY_QUEUE
        │
        ▼
Rider Service consumes event
        │
        ▼
Nearby riders detected
        │
        ▼
Realtime Service emits event
        │
        ▼
Rider accepts order
```

---

# 3. Socket.IO Realtime Communication

Realtime Service manages live communication.

---

# Socket Rooms

## User Room
```txt
user:<userId>
```

Used for:
- Order updates
- Rider notifications
- Payment updates

---

# Restaurant Room
```txt
restaurant:<restaurantId>
```

Used for:
- Incoming orders
- Order status updates

---

# Realtime Events

## Rider Events
```txt
order:available
order:accepted
```

## Customer Events
```txt
order:status
rider:location
```

---

# Internal Security

Internal service communication uses:

```txt
x-internal-key
```

This prevents unauthorized internal requests.

---

# Why Microservices?

Microservices provide:

- Independent deployment
- Better scalability
- Fault isolation
- Easier maintenance
- Domain separation

---

# Scalability Advantages

Each service can scale independently.

Example:
- Realtime Service can scale separately
- Rider Service can scale during peak delivery hours
- Payment Service can scale independently

---

# Failure Isolation

If one service fails:
- Other services continue functioning
- Queue-based retries improve resilience
- Realtime system remains operational

---

# Future Improvements

- API Gateway
- Kubernetes orchestration
- Redis caching
- Distributed tracing
- Centralized logging
- Service discovery