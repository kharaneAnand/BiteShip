# Security Architecture Documentation

# Overview

BiteShip implements multiple security layers across:

- Authentication
- Authorization
- Internal service communication
- Payments
- Real-time systems

The platform follows a defense-in-depth approach to secure all critical workflows.

---

# Authentication System

# Technology Used

```txt
JWT (JSON Web Token)
```

---

# Authentication Flow

```txt
Google OAuth Login
        │
        ▼
Auth Service
        │
        ▼
JWT Token Generated
        │
        ▼
Frontend Stores Token
```

---

# JWT Payload

```ts
{
  user: {
    _id,
    name,
    email,
    role,
    restaurantId
  }
}
```

---

# Token Expiration

```txt
15 Days
```

---

# Why JWT?

Advantages:

- Stateless authentication
- Fast verification
- Easy microservice integration
- Scalable architecture

---

# Google OAuth Security

# OAuth Provider

```txt
Google OAuth 2.0
```

---

# Login Strategy

Frontend receives:

```txt
Authorization Code
```

Backend exchanges it for:

- Access token
- User profile

---

# Security Advantages

- No password storage
- Trusted authentication provider
- Reduced credential risk

---

# Authorization System

# Role-Based Access Control (RBAC)

Supported roles:

```txt
customer
seller
rider
admin
```

---

# Middleware Protection

## Customer Routes

```txt
isAuth
```

---

## Seller Routes

```txt
isAuth + isSeller
```

---

## Admin Routes

```txt
isAuth + isAdmin
```

---

# Route Protection Example

```ts
router.post(
  "/new",
  isAuth,
  isSeller,
  addRestaurant
)
```

---

# Internal Service Security

# Problem

Microservices expose internal endpoints.

Without protection:

```txt
Any user could trigger internal APIs
```

---

# Solution

Internal APIs require:

```txt
x-internal-key
```

---

# Protected Internal Routes

Examples:

- Payment confirmation
- Realtime event emission
- Rider assignment

---

# Example Validation

```ts
if(req.headers["x-internal-key"] !== process.env.INTERNAL_SERVICE_KEY)
```

---

# Benefit

Prevents:

- Unauthorized internal access
- Fake service requests
- Event spoofing

---

# Payment Security

# Payment Provider

```txt
Razorpay
```

---

# Security Features

- Signature verification
- Server-side payment validation
- Queue-based confirmation flow

---

# Razorpay Verification

Payments are verified using:

```txt
HMAC SHA256 Signature Validation
```

---

# Verification Flow

```txt
Payment Success
      │
      ▼
Signature Validation
      │
      ▼
Payment Queue Event
```

---

# Why Verify Signatures?

Prevents:

- Fake payments
- Tampered transactions
- Client-side manipulation

---

# RabbitMQ Security

# Queue Isolation

Queues are accessible only through:

```txt
RabbitMQ Credentials
```

---

# Current Infrastructure

RabbitMQ hosted on:

```txt
AWS EC2
```

---

# Durable Queues

Messages are stored persistently:

```ts
persistent: true
```

---

# Benefit

Protects against:

- Message loss
- Service crashes
- Temporary downtime

---

# Realtime Security

# Technology

```txt
Socket.IO
```

---

# Socket Authentication

Each socket connection validates:

```txt
JWT Token
```

---

# Socket Security Flow

```txt
Client Connects
       │
       ▼
JWT Verification
       │
       ▼
Authorized Socket Room
```

---

# Unauthorized Connections

Invalid tokens are rejected immediately.

---

# Room-Based Isolation

Users only receive events for:

```txt
user:<userId>
restaurant:<restaurantId>
```

---

# Benefit

Prevents:

- Cross-user data leaks
- Unauthorized order visibility
- Event interception

---

# Database Security

# MongoDB Security Features

- Indexed queries
- Input validation
- ObjectId validation

---

# Example Validation

```ts
mongoose.Types.ObjectId.isValid(id)
```

---

# Why Validate IDs?

Prevents:

- Invalid queries
- Injection attacks
- Application crashes

---

# File Upload Security

# Upload Strategy

Files are uploaded using:

```txt
Multer Memory Storage
```

---

# Storage Flow

```txt
Frontend Upload
      │
      ▼
Memory Buffer
      │
      ▼
Cloudinary Upload
```

---

# Security Benefits

- No local file storage
- Reduced server exposure
- Cloud-based asset handling

---

# CORS Protection

Services enable controlled cross-origin access.

---

# Current Deployment Limitation

Frontend deployment currently has:

```txt
Google OAuth CORS Issues
```

Therefore frontend deployment is temporarily paused.

---

# Infrastructure Security

# Deployment Platforms

| Component | Platform |
|---|---|
| Microservices | Render |
| RabbitMQ | AWS EC2 |
| Database | MongoDB Cloud |
| Media Storage | Cloudinary |

---

# Security Advantages

- Managed infrastructure
- Environment isolation
- Independent scaling
- Secure secret storage

---

# Environment Variable Security

Sensitive data stored in:

```env
.env
```

Examples:

- JWT secrets
- Razorpay keys
- Cloudinary keys
- RabbitMQ credentials

---

# Secrets Never Exposed

Secrets are never committed to frontend code.

---

# Failure Isolation

Microservice separation limits blast radius.

Example:

If Admin Service fails:

```txt
Orders and Payments still work
```

---

# Security Strengths

The BiteShip architecture provides:

- Secure authentication
- Protected internal APIs
- Payment verification
- Real-time socket security
- Role-based access control
- Event-driven isolation

---

# Future Security Improvements

Planned future upgrades:

- HTTPS everywhere
- API Gateway
- Rate limiting
- Helmet middleware
- CSRF protection
- Refresh tokens
- Redis session management
- WAF protection

---

# Final Security Summary

BiteShip follows modern backend security practices using:

- JWT authentication
- OAuth login
- Queue isolation
- Signature verification
- Internal API protection
- Role-based authorization

This creates a scalable and secure production-grade architecture.