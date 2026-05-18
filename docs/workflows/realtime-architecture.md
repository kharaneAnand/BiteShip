# BiteShip Realtime Architecture

# Overview

BiteShip uses Socket.IO for realtime communication between:

- Customers
- Restaurants
- Riders

Realtime communication is isolated into a dedicated Realtime Service.

---

# Why Dedicated Realtime Service?

Instead of embedding Socket.IO inside business services, BiteShip uses a separate service for:

- Better scalability
- Independent deployment
- Lower coupling
- Easier maintenance
- Fault isolation

---

# Realtime Service Responsibilities

The Realtime Service handles:

- Socket authentication
- Room management
- Event broadcasting
- Live tracking
- Delivery notifications

---

# Authentication Flow

Socket connections are authenticated using JWT.

## Flow

```txt
Frontend
   │
   ▼
Socket Connection Request
   │
   ▼
JWT Verification
   │
   ▼
Socket Authorized
```

---

# Socket Authentication

JWT token is passed during socket handshake.

## Example

```txt
socket.handshake.auth.token
```

The token is verified before allowing connection.

---

# Socket Rooms

BiteShip uses room-based communication.

---

# User Rooms

```txt
user:<userId>
```

## Used For
- Order updates
- Rider notifications
- Payment status
- Delivery tracking

---

# Restaurant Rooms

```txt
restaurant:<restaurantId>
```

## Used For
- Incoming orders
- Restaurant order updates
- Rider assignment notifications

---

# Connection Lifecycle

## 1. User Connects

```txt
Socket Connection
      │
      ▼
JWT Verification
      │
      ▼
User added to rooms
```

---

# 2. Rooms Assigned

## Customer
```txt
user:<userId>
```

## Seller
```txt
user:<userId>
restaurant:<restaurantId>
```

## Rider
```txt
user:<userId>
```

---

# Event Architecture

---

# Rider Events

## order:available

Sent when:
- Nearby delivery request found

Triggered by:
- Rider Service

---

# order:accepted

Sent when:
- Rider accepts order

Triggered by:
- Rider Service

---

# Customer Events

## order:status

Sent when:
- Order status changes

Examples:
```txt
accepted
preparing
picked_up
delivered
```

---

# rider:location

Sent when:
- Rider location changes

Used for:
- Live delivery tracking

---

# Internal Event Emission

Services communicate with Realtime Service using internal APIs.

---

# Internal Route

```txt
/api/v1/internal/emit
```

---

# Security

Internal communication protected using:

```txt
x-internal-key
```

Only trusted services can emit events.

---

# Example Realtime Flow

# Rider Assignment

```txt
Restaurant marks order ready
        │
        ▼
RabbitMQ Event Published
        │
        ▼
Rider Service consumes event
        │
        ▼
Nearby riders detected
        │
        ▼
Realtime Service emits:
order:available
        │
        ▼
Rider receives request instantly
```

---

# Live Tracking Flow

```txt
Rider location updated
        │
        ▼
Realtime Service
        │
        ▼
Customer receives:
rider:location
```

---

# Scalability Advantages

Dedicated realtime service allows:

- Horizontal scaling
- Independent socket scaling
- Reduced load on business services

---

# Future Improvements

- Redis Socket.IO Adapter
- Multi-instance socket scaling
- Push notifications
- WebRTC communication
- Kafka-based event streaming

---

# Failure Isolation

If realtime service fails:
- Orders still function
- Payments still function
- Queue processing continues

Realtime failures do not break business logic.

---

# Engineering Benefits

This architecture provides:

- Clean separation of concerns
- Scalable realtime infrastructure
- Independent deployments
- Better maintainability
- Production-grade event handling