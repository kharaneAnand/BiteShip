# BiteShip HLD (High Level Design) — Explanation


BiteShip is a scalable food delivery platform inspired by systems like Swiggy and Zomato.

I specifically designed this project to learn:

- Microservices Architecture
- Distributed Systems
- Real-time Communication
- Queue-based Workflows
- Production Backend Engineering

Instead of building a normal monolithic MERN project, I designed the platform using independent backend services communicating through REST APIs, RabbitMQ, and Socket.IO.

---

# Why I Chose Microservices

Food delivery systems contain multiple independent workflows like:

- Authentication
- Orders
- Payments
- Rider allocation
- Realtime tracking
- Admin analytics

If everything is inside one backend:

- deployments become difficult
- scaling becomes inefficient
- failures affect the complete system
- debugging becomes harder

So I separated the platform into independent services.

---

# Services in My Architecture

| Service | Responsibility |
|---|---|
| Auth Service | Authentication & JWT |
| Restaurant Service | Restaurants, orders, carts |
| Rider Service | Rider workflows |
| Utils Service | Payments & Cloudinary uploads |
| Realtime Service | Socket.IO realtime events |
| Admin Service | Analytics & verification |

---

# Overall Architecture Flow

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

# Authentication Flow

I implemented Google OAuth authentication.

Flow is:

```txt
Frontend Login
      │
      ▼
Google OAuth
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

I used JWT because it is stateless and scalable for microservices.

Each service independently validates the token.

---

# Why I Used Google OAuth

I used Google OAuth because:

- users do not need passwords
- authentication becomes secure
- onboarding becomes faster
- no password storage risk exists

This is closer to production systems.

---

# Restaurant Discovery System

Restaurants are stored using MongoDB GeoSpatial coordinates.

I used:

```txt
2dsphere indexes
```

This enables:

- nearby restaurant search
- distance calculation
- delivery optimization

---

# Why GeoSpatial Queries

Instead of calculating distances manually, MongoDB handles it efficiently using:

```txt
$near
$geometry
$maxDistance
```

This is scalable and production-friendly.

---

# Cart Architecture

Cart supports:

- add item
- increment quantity
- decrement quantity
- clear cart

I intentionally enforced:

```txt
One restaurant order at a time
```

because it simplifies:

- delivery handling
- rider allocation
- payment workflows

---

# Cart Optimization

I used compound unique indexes:

```txt
userId + restaurantId + itemId
```

This prevents duplicate cart entries.

Instead of multiple rows, quantity automatically increases.

---

# Order System

Orders are the central entity of the platform.

Orders contain:

- customer snapshot
- restaurant snapshot
- item snapshot
- rider details
- payment status
- delivery status

---

# Why Snapshot Data

I intentionally store item names and prices inside the order.

Reason:

If restaurant changes menu later, historical orders remain correct.

This is a production-grade design decision.

---

# Payment Architecture

Payments are handled using Razorpay.

Flow:

```txt
Customer Places Order
        │
        ▼
Utils Service Creates Razorpay Order
        │
        ▼
Customer Completes Payment
        │
        ▼
Signature Verification
        │
        ▼
RabbitMQ PAYMENT_SUCCESS Event
        │
        ▼
Restaurant Service Updates Order
```

---

# Why I Used RabbitMQ

Without queues:

services become tightly coupled.

Using RabbitMQ gives:

- loose coupling
- async workflows
- retries
- failure isolation
- scalability

---

# Rider Allocation Architecture

This is one of the strongest parts of my project.

Flow:

```txt
Restaurant Marks Order Ready
          │
          ▼
RabbitMQ Event Published
          │
          ▼
Rider Service Consumes Event
          │
          ▼
Nearby Riders Queried
          │
          ▼
Realtime Notification Sent
```

---

# Nearby Rider Search

Riders are queried using GeoSpatial indexing.

I use:

```txt
$near
$maxDistance
```

This simulates real-world delivery allocation systems.

---

# Realtime Architecture

Realtime communication is handled using:

```txt
Socket.IO
```

I intentionally created a dedicated realtime service.

---

# Why Separate Realtime Service

Sockets are stateful while REST APIs are stateless.

Separating them improves:

- scalability
- maintainability
- deployment flexibility

---

# Socket Room Strategy

Users join rooms like:

```txt
user:<userId>
restaurant:<restaurantId>
```

Benefits:

- targeted events
- efficient broadcasting
- lower network overhead

---

# Example Realtime Event

```txt
order:available
```

This is sent only to nearby riders.

---

# Admin Architecture

Admin Service is separated from customer-facing services.

Responsibilities:

- restaurant verification
- rider verification
- analytics
- monitoring

---

# Why Separate Admin Service

Admin traffic is completely different from customer traffic.

Separation improves:

- security
- scalability
- analytics isolation

---

# Database Design

I used MongoDB because:

- schema flexibility
- excellent GeoSpatial support
- microservice compatibility
- rapid development

---

# Main Collections

- users
- restaurants
- menuitems
- carts
- addresses
- riders
- orders

---

# TTL Expiration Strategy

Orders contain:

```txt
expiresAt
```

MongoDB automatically removes unpaid expired orders using TTL indexing.

This avoids manual cleanup jobs.

---

# Deployment Architecture

| Component | Platform |
|---|---|
| Backend Services | Render |
| RabbitMQ | AWS EC2 |
| Database | MongoDB Cloud |
| Media Storage | Cloudinary |

---

# Why I Used EC2 for RabbitMQ

Managed RabbitMQ services were expensive.

So I manually deployed RabbitMQ on AWS EC2.

This gave me:

- infrastructure experience
- deployment understanding
- queue management experience

---

# Failure Isolation

If Rider Service crashes:

- ordering still works
- payments still work
- restaurants still work

Only rider assignment pauses.

This is one major advantage of microservices.

---

# Scalability Discussion

Each service scales independently.

For example:

If realtime traffic increases:

only Realtime Service needs scaling.

This is much better than monolithic scaling.

---

# Security Design

Security layers include:

- JWT authentication
- Google OAuth
- role-based authorization
- internal service keys
- payment signature verification

---

# Technologies Used

Frontend:

- React
- TypeScript
- Tailwind CSS

Backend:

- Node.js
- Express.js
- TypeScript

Infrastructure:

- RabbitMQ
- MongoDB
- Socket.IO
- Razorpay
- Cloudinary

---

# Final Interview Conclusion

BiteShip is not just a CRUD MERN project.

It demonstrates:

- distributed systems understanding
- microservices architecture
- queue-based workflows
- realtime communication
- production backend engineering
- scalable architecture design

The main focus of this project was building a backend system closer to real-world production architecture.