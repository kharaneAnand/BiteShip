# Admin Service API Documentation

# Overview

The Admin Service manages platform administration features.

It handles:

- Restaurant verification
- Rider verification
- Admin analytics
- Partner monitoring
- Platform management

---

# Architecture Purpose

The Admin Service is separated from customer-facing services to provide:

- Security isolation
- Independent scaling
- Controlled administrative access
- Cleaner architecture

---

# Base Route

```txt
/api/v1
```

---

# Authentication

All admin routes require:

- JWT Authentication
- Admin authorization

---

# Middleware Protection

```txt
isAuth
isAdmin
```

---

# Restaurant Management APIs

---

# Get Pending Restaurants

## Endpoint

```http
GET /api/v1/admin/restaurant/pending
```

---

# Purpose

Fetch restaurants waiting for verification.

---

# Response

```json
{
  "count": 2,
  "restaurants": []
}
```

---

# Verify Restaurant

## Endpoint

```http
PATCH /api/v1/verify/restaurant/:id
```

---

# Purpose

Approve a restaurant partner.

---

# Verification Flow

```txt
Restaurant Registers
        │
        ▼
Pending Verification
        │
        ▼
Admin Reviews
        │
        ▼
Restaurant Approved
```

---

# Rider Management APIs

---

# Get Pending Riders

## Endpoint

```http
GET /api/v1/admin/rider/pending
```

---

# Purpose

Fetch riders awaiting approval.

---

# Verify Rider

## Endpoint

```http
PATCH /api/v1/verify/rider/:id
```

---

# Purpose

Approve a rider after document verification.

---

# Rider Verification Checks

- Aadhar Number
- Driving License
- Rider profile
- Availability setup

---

# Verified Restaurant Analytics

## Endpoint

```http
GET /api/v1/admin/restaurant/verified
```

---

# Features

Returns:

- Total orders
- Revenue
- Restaurant statistics

---

# Revenue Calculation

Revenue is calculated using:

```txt
Delivered Orders + Paid Payments
```

---

# Verified Rider Analytics

## Endpoint

```http
GET /api/v1/admin/rider/verified
```

---

# Features

Returns:

- Completed deliveries
- Earnings
- Rider ratings
- Availability

---

# Database Strategy

Admin Service directly accesses MongoDB collections using:

- Native MongoDB Driver
- Shared database access

---

# Collections Used

- restaurants
- riders
- orders

---

# Why Native MongoDB Driver?

Advantages:

- Faster aggregation
- Lightweight admin queries
- Reduced service dependencies
- Better analytics flexibility

---

# Security Model

Admin APIs are protected using:

- JWT authentication
- Role-based access control

---

# Access Restriction

Only users with:

```txt
role = admin
```

can access admin routes.

---

# Failure Isolation

Admin failures do not affect:

- Orders
- Payments
- Deliveries
- Authentication

This maintains high platform availability.

---

# Scalability Advantages

Dedicated admin infrastructure enables:

- Independent deployments
- Analytics scaling
- Secure administrative isolation

---

# Future Improvements

- Admin dashboards with charts
- Fraud detection
- Rider suspension
- Restaurant suspension
- Revenue analytics
- Weekly reports
- Platform monitoring

---

# Technologies Used

- Express.js
- MongoDB Native Driver
- JWT
- Node.js

---

# Environment Variables

```env
MONGO_URI=
DB_NAME=
JWT_SEC=
```

---

# Core Responsibilities

The Admin Service handles:

- Partner verification
- Rider verification
- Platform moderation
- Analytics aggregation
- Administrative controls