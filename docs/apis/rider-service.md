# Rider Service API Documentation

# Overview

The Rider Service manages:

- Rider onboarding
- Rider availability
- Rider delivery lifecycle
- Rider order assignment
- Nearby rider matching

---

# Base Route

```txt
/api/rider
```

---

# Core Features

- Rider profile creation
- Geo-location tracking
- Nearby rider matching
- Realtime delivery workflows
- Order acceptance system

---

# Routes

---

# 1. Create Rider Profile

## Endpoint

```http
POST /api/rider/new
```

## Protected Route

```txt
Rider Only
```

---

## Form Data

```txt
picture
phoneNumber
aadharNumber
drivingLicenseNumber
latitude
longitude
```

---

## Features

- Cloudinary image upload
- GeoJSON location storage
- Rider verification workflow

---

# 2. Fetch My Rider Profile

## Endpoint

```http
GET /api/rider/myprofile
```

---

# 3. Toggle Rider Availability

## Endpoint

```http
PATCH /api/rider/toggle
```

---

## Description

Updates rider online/offline availability status.

---

# 4. Accept Delivery Order

## Endpoint

```http
POST /api/rider/accept/:orderId
```

---

## Features

- Rider assignment
- Prevent duplicate assignment
- Realtime updates

---

# 5. Fetch Current Rider Order

## Endpoint

```http
GET /api/rider/order/current
```

---

## Description

Returns currently assigned delivery order.

---

# 6. Update Delivery Status

## Endpoint

```http
PUT /api/rider/order/update/:orderId
```

---

## Supported Status

```txt
picked_up
delivered
```

---

# Rider Matching System

Nearby riders are detected using:

```txt
MongoDB GeoJSON Queries
```

---

# Matching Logic

Riders must be:

```txt
isAvailable = true
isVerified = true
```

---

# Search Radius

```txt
1500 meters
```

---

# Queue Communication

---

# Consumes

```txt
ORDER_READY_QUEUE
```

---

# Workflow

```txt
Restaurant marks order ready
        │
        ▼
RabbitMQ Event
        │
        ▼
Rider Service consumes event
        │
        ▼
Nearby riders detected
        │
        ▼
Realtime notification emitted
```

---

# Realtime Integration

Rider Service communicates with:

```txt
Realtime Service
```

Using:

```txt
/api/v1/internal/emit
```

---

# Realtime Events

## Emits

```txt
order:available
order:accepted
```

---

# Database Features

## GeoJSON Index

Used for:
- Nearby rider matching
- Delivery allocation

---

# Security

- JWT Authentication
- Protected rider routes
- Internal service keys

---

# Technologies Used

- Express.js
- MongoDB
- RabbitMQ
- Socket.IO
- Cloudinary

---

# Environment Variables

```env
MONGO_URI=
JWT_SEC=
RABBITMQ_URL=
REALTIME_SERVICE=
UTILS_SERVICE=
```

---

# Core Responsibilities

The Rider Service is responsible for:

- Rider onboarding
- Rider assignment
- Delivery lifecycle management
- Nearby rider detection
- Delivery status workflows
- Realtime rider coordination