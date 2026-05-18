# BiteShip Order Lifecycle

# Overview

This document explains the complete lifecycle of an order in BiteShip from customer order placement to final delivery.

---

# Order Lifecycle Stages

```txt
placed
accepted
preparing
ready_for_rider
rider_assigned
picked_up
delivered
```

---

# 1. Customer Places Order

## Flow

```txt
Customer → Restaurant Service
```

## Actions

- Customer selects items
- Address is selected
- Payment initiated
- Order document created

## Initial Status

```txt
placed
```

---

# 2. Payment Verification

## Flow

```txt
Customer
   │
   ▼
Utils Service
   │
   ▼
Razorpay Verification
   │
   ▼
PAYMENT_QUEUE
   │
   ▼
Restaurant Service
```

## Actions

- Payment signature verified
- RabbitMQ event published
- Restaurant Service updates payment status

## Payment Status

```txt
pending → paid
```

---

# 3. Restaurant Accepts Order

## Flow

```txt
Restaurant Dashboard
      │
      ▼
Restaurant Service
```

## Actions

- Restaurant reviews order
- Order accepted
- Customer receives realtime update

## Status

```txt
accepted
```

---

# 4. Order Preparation

## Flow

```txt
Restaurant prepares food
```

## Actions

- Cooking begins
- Status updated in realtime

## Status

```txt
preparing
```

---

# 5. Order Ready For Pickup

## Flow

```txt
Restaurant marks order ready
        │
        ▼
ORDER_READY_QUEUE
        │
        ▼
Rider Service
```

## Actions

- RabbitMQ event emitted
- Nearby riders searched using GeoJSON
- Realtime notifications sent

## Status

```txt
ready_for_rider
```

---

# 6. Rider Assignment

## Flow

```txt
Rider receives request
        │
        ▼
Rider accepts order
        │
        ▼
Restaurant Service updated
```

## Actions

- Rider accepts delivery
- Rider assigned to order
- Customer notified in realtime

## Status

```txt
rider_assigned
```

---

# 7. Rider Picks Up Order

## Flow

```txt
Rider Dashboard
      │
      ▼
Realtime Updates
```

## Actions

- Rider reaches restaurant
- Order picked up
- Live tracking starts

## Status

```txt
picked_up
```

---

# 8. Order Delivered

## Flow

```txt
Rider → Customer
```

## Actions

- Rider delivers order
- Final status updated
- Delivery completed

## Status

```txt
delivered
```

---

# Realtime Updates

Socket.IO provides:

- Live order status
- Rider assignment updates
- Rider location tracking
- Delivery completion notifications

---

# Rider Matching Logic

Riders are matched using:

- MongoDB geospatial queries
- GeoJSON indexing
- Nearby radius filtering

---

# Failure Handling

## Payment Failure
```txt
paymentStatus = failed
```

## No Rider Available
- Order remains waiting
- Riders retried later

## Order Cancellation
```txt
status = cancelled
```

---

# Queue-Based Reliability

RabbitMQ ensures:

- Async processing
- Reliable delivery
- Decoupled services
- Better scalability

---

# Order Expiration

Orders include:

```txt
expiresAt
```

MongoDB TTL indexes automatically remove expired unpaid orders.

---

# Scalability Benefits

The workflow is scalable because:

- Payment system isolated
- Rider matching isolated
- Realtime service isolated
- Queue processing asynchronous

---

# Future Improvements

- Delivery ETA prediction
- Smart rider allocation
- Multi-rider batching
- Delivery heatmaps
- AI delivery optimization