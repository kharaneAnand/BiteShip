# Microservices Communication Architecture

# Overview

BiteShip follows a distributed microservice architecture where services communicate using:

- REST APIs
- RabbitMQ event queues
- Internal realtime event broadcasting

This architecture improves:

- Scalability
- Fault isolation
- Independent deployments
- System reliability

---

# Communication Types

| Type | Usage |
|---|---|
| REST APIs | Synchronous communication |
| RabbitMQ | Asynchronous event processing |
| Socket.IO | Real-time updates |

---

# Service Communication Flow

```txt
Frontend
   │
   ▼
API Services
   │
   ├── REST APIs
   ├── RabbitMQ Events
   └── Realtime Socket Events
```

---

# REST API Communication

# Purpose

Used for immediate request-response operations.

---

# Examples

| Service | Purpose |
|---|---|
| Auth Service | Authentication |
| Restaurant Service | Orders & restaurants |
| Rider Service | Rider actions |
| Admin Service | Verification & analytics |
| Utils Service | Payments & uploads |

---

# Advantages

- Simple architecture
- Easy debugging
- Clear separation

---

# RabbitMQ Event Communication

# Purpose

Used for asynchronous workflows.

---

# Why Event Queues?

Without queues:

```txt
Services become tightly coupled
```

With RabbitMQ:

```txt
Services communicate independently
```

---

# Current Queue Architecture

| Queue | Purpose |
|---|---|
| PAYMENT_QUEUE | Payment success events |
| ORDER_READY_QUEUE | Rider delivery assignment |

---

# Payment Flow

```txt
Customer Pays
      │
      ▼
Utils Service
      │
      ▼
PAYMENT_SUCCESS Event
      │
      ▼
Restaurant Service Updates Order
```

---

# Rider Allocation Flow

```txt
Restaurant Ready Order
        │
        ▼
ORDER_READY_FOR_RIDER Event
        │
        ▼
Rider Service Consumes Queue
        │
        ▼
Nearby Riders Notified
```

---

# RabbitMQ Benefits

- Decoupled architecture
- Retry support
- Durable queues
- Better scalability
- Event-driven workflows

---

# Durable Queue Strategy

Queues are configured as:

```ts
durable: true
```

---

# Benefit

Messages survive:

- Service crashes
- Server restarts
- Temporary failures

---

# Real-time Communication

# Technology Used

```txt
Socket.IO
```

---

# Purpose

Provides instant updates for:

- Rider notifications
- Order tracking
- Delivery updates
- Live rider assignment

---

# Realtime Architecture

```txt
Realtime Service
       │
       ▼
Socket Rooms
       │
       ▼
Connected Users
```

---

# Socket Room Strategy

Users join rooms dynamically:

```txt
user:<userId>
restaurant:<restaurantId>
```

---

# Advantages

- Targeted messaging
- Reduced traffic
- Efficient broadcasting

---

# Example Event

```txt
order:available
```

Sent to nearby riders.

---

# Internal Event Broadcasting

Services communicate with Realtime Service using:

```txt
/api/v1/internal/emit
```

---

# Security Layer

Protected using:

```txt
x-internal-key
```

---

# Internal Event Example

```json
{
  "event": "order:available",
  "room": "user:123",
  "payload": {}
}
```

---

# Authentication Between Services

Internal service communication uses:

```txt
INTERNAL_SERVICE_KEY
```

---

# Why Internal Keys?

Prevents:

- Unauthorized service access
- Fake internal events
- External abuse

---

# Failure Isolation

Microservices are independently deployable.

Failure of one service does NOT stop:

- Authentication
- Orders
- Payments
- Riders
- Admin operations

---

# Example

If Rider Service crashes:

- Customers can still order
- Payments still work
- Restaurants still operate

Only delivery assignment pauses.

---

# Scalability Advantages

Each service scales independently.

Example:

```txt
High payment traffic
       │
       ▼
Scale Utils Service only
```

---

# Deployment Flexibility

Each service is deployed separately on Render.

Advantages:

- Faster deployments
- Easier debugging
- Better monitoring
- Independent restarts

---

# Communication Design Strengths

The BiteShip communication architecture provides:

- Loose coupling
- Real-time responsiveness
- Event-driven scalability
- Independent service ownership
- High availability
- Better system reliability

---

# Future Improvements

Future architecture upgrades may include:

- Kafka event streaming
- Redis Pub/Sub
- gRPC communication
- Service discovery
- API Gateway
- Kubernetes orchestration

---

# Architecture Summary

BiteShip uses:

- REST APIs for direct communication
- RabbitMQ for asynchronous workflows
- Socket.IO for real-time delivery tracking

This creates a highly scalable production-grade architecture.