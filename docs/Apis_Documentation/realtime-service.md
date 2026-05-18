# Realtime Service API Documentation

# Overview

The Realtime Service manages:

- Socket.IO connections
- Realtime event broadcasting
- Room-based communication
- Live order updates
- Rider tracking

---

# Architecture Purpose

Realtime communication is isolated into a dedicated microservice for:

- Independent scaling
- Better maintainability
- Lower coupling
- Fault isolation

---

# Base Route

```txt
/api/v1
```

---

# Socket Authentication

Socket connections use JWT authentication.

---

# Authentication Flow

```txt
Frontend
   │
   ▼
Socket Connection
   │
   ▼
JWT Verification
   │
   ▼
Socket Authorized
```

---

# Socket Handshake

JWT token passed using:

```txt
socket.handshake.auth.token
```

---

# Socket Rooms

---

# User Rooms

```txt
user:<userId>
```

---

## Used For

- Order updates
- Rider notifications
- Delivery updates
- Payment notifications

---

# Restaurant Rooms

```txt
restaurant:<restaurantId>
```

---

## Used For

- Incoming orders
- Restaurant order updates
- Rider assignment updates

---

# Internal Event API

---

# Emit Event

## Endpoint

```http
POST /api/v1/internal/emit
```

---

# Security

Protected using:

```txt
x-internal-key
```

---

# Request Body

```json
{
  "event": "order:available",
  "room": "user:123",
  "payload": {}
}
```

---

# Features

- Realtime room broadcasting
- Internal service communication
- Cross-service event propagation

---

# Realtime Events

---

# Rider Events

## order:available

Triggered when:
- Nearby order detected

---

## order:accepted

Triggered when:
- Rider accepts delivery

---

# Customer Events

## order:status

Triggered when:
- Order status changes

---

## rider:location

Triggered when:
- Rider location updates

---

# Room Assignment Logic

---

# Customer

```txt
user:<userId>
```

---

# Seller

```txt
user:<userId>
restaurant:<restaurantId>
```

---

# Rider

```txt
user:<userId>
```

---

# Connection Lifecycle

```txt
Socket Connect
      │
      ▼
JWT Verification
      │
      ▼
Join Rooms
      │
      ▼
Receive Events
```

---

# Internal Service Communication

Services communicate with Realtime Service using:

- HTTP APIs
- Internal service keys

---

# Failure Isolation

If realtime service fails:
- Business services continue
- Orders continue processing
- Payments remain operational

Realtime failures do not stop core workflows.

---

# Scalability Advantages

Dedicated realtime infrastructure allows:

- Horizontal socket scaling
- Independent deployment
- Reduced backend load

---

# Future Improvements

- Redis Socket.IO Adapter
- Multi-instance scaling
- Push notifications
- WebRTC integration
- Kafka event streaming

---

# Technologies Used

- Express.js
- Socket.IO
- JWT
- Node.js

---

# Environment Variables

```env
JWT_SEC=
INTERNAL_SERVICE_KEY=
```

---

# Core Responsibilities

The Realtime Service is responsible for:

- Socket authentication
- Room management
- Realtime broadcasting
- Delivery tracking
- Live notifications
- Cross-service event delivery