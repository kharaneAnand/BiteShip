# BiteShip LLD (Low Level Design) —  Explanation

# How I Explain LLD

After explaining the overall architecture, I explain how I designed the internal components, database models, middleware, workflows, and realtime logic.

The goal of my LLD was:

- clean code separation
- reusable architecture
- scalable backend structure
- production-grade workflows

---

# Backend Folder Structure

Each microservice follows a structured architecture:

```txt
src
 ├── controllers
 ├── routes
 ├── middleware
 ├── models
 ├── config
 └── utils
```

---

# Why I Used This Structure

This improves:

- maintainability
- readability
- scalability
- team collaboration

Each layer has a single responsibility.

---

# Controller Layer

Controllers contain business logic.

Examples:

- createOrder
- addRestaurant
- addMenuItem
- verifyPayment
- assignRider

---

# Why Controllers

I separated controllers because:

- routes stay clean
- logic becomes reusable
- debugging becomes easier

---

# Route Layer

Routes only handle:

- endpoint registration
- middleware chaining
- controller mapping

Example:

```txt
router.post(
  \"/new\",
  isAuth,
  addRestaurant
)
```

---

# Middleware Design

I created reusable middleware.

Main middleware:

- isAuth
- isSeller
- isAdmin
- uploadFile
- TryCatch

---

# Authentication Middleware

`isAuth` middleware:

- extracts JWT
- verifies token
- attaches user to request

This avoids repeating authentication logic.

---

# Role-Based Middleware

Examples:

```txt
isSeller
isAdmin
```

These ensure route-level authorization.

---

# TryCatch Wrapper

All controllers are wrapped inside:

```txt
TryCatch()
```

Purpose:

- centralized async error handling
- cleaner code
- avoids repetitive try-catch blocks

---

# Database Model Design

I used Mongoose models with TypeScript interfaces.

This gives:

- type safety
- schema validation
- better scalability

---

# Restaurant Model

Restaurant contains:

- name
- image
- ownerId
- GeoSpatial location
- verification status

---

# GeoSpatial Design

Restaurant location is stored using:

```txt
GeoJSON Point
```

Example:

```txt
coordinates: [longitude, latitude]
```

---

# Why Longitude First?

MongoDB GeoJSON format requires:

```txt
[longitude, latitude]
```

This is important for GeoSpatial queries.

---

# GeoSpatial Indexing

I added:

```txt
2dsphere index
```

This enables:

- nearby search
- rider allocation
- delivery optimization

---

# Menu Item Model

Menu items contain:

- restaurantId
- name
- description
- image
- price
- availability

---

# Why Availability Flag?

Instead of deleting unavailable items:

I toggle:

```txt
isAvailable
```

Benefits:

- historical consistency
- faster operations
- simpler management

---

# Cart Model

Cart stores:

- userId
- restaurantId
- itemId
- quantity

---

# Cart Constraint

I intentionally allowed:

```txt
One restaurant at a time
```

This simplifies:

- rider allocation
- payments
- order processing

---

# Cart Optimization

I used compound unique indexes:

```txt
userId + restaurantId + itemId
```

Benefits:

- prevents duplicates
- automatic quantity updates
- cleaner cart logic

---

# Order Model

Order is the most detailed model.

It stores:

- customer snapshot
- rider snapshot
- item snapshots
- payment details
- delivery details
- order status

---

# Why Snapshot Data?

Order stores item names and prices directly.

Reason:

If restaurant changes menu later:

old orders remain correct.

This is a real-world production design pattern.

---

# Order Status Flow

```txt
placed
accepted
preparing
ready_for_rider
rider_assigned
picked_up
delivered
cancelled
```

---

# Why Status-Based Workflow?

Benefits:

- predictable state transitions
- realtime updates
- easier analytics
- workflow tracking

---

# TTL Index Design

Orders contain:

```txt
expiresAt
```

MongoDB automatically removes expired unpaid orders.

Benefits:

- automatic cleanup
- avoids cron jobs
- database hygiene

---

# Rider Model

Rider contains:

- identity documents
- availability
- location
- verification status

---

# Rider GeoSpatial Queries

Riders are searched using:

```txt
$near
$maxDistance
```

This enables nearby rider allocation.

---

# File Upload Architecture

Upload flow:

```txt
Frontend Upload
      │
      ▼
Multer Memory Buffer
      │
      ▼
DataURI Conversion
      │
      ▼
Cloudinary Upload
```

---

# Why Multer Memory Storage?

Advantages:

- avoids local file storage
- cloud-friendly
- safer deployment

---

# Why Cloudinary?

Cloudinary provides:

- CDN delivery
- image optimization
- scalable media hosting

---

# RabbitMQ Design

RabbitMQ is used for asynchronous workflows.

Current queues:

- PAYMENT_QUEUE
- ORDER_READY_QUEUE

---

# Why Queues?

Without queues:

services become tightly coupled.

RabbitMQ enables:

- retries
- async processing
- scalability
- failure isolation

---

# Payment Queue Workflow

```txt
Payment Success
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

# Rider Queue Workflow

```txt
Order Ready
      │
      ▼
ORDER_READY_FOR_RIDER Event
      │
      ▼
Rider Service Consumes Event
      │
      ▼
Nearby Riders Notified
```

---

# Realtime Service Design

Realtime communication is separated into its own service.

Technology used:

```txt
Socket.IO
```

---

# Why Separate Socket Service?

Sockets are stateful.

REST APIs are stateless.

Separating them improves:

- scaling
- deployment
- maintainability

---

# Socket Authentication

Every socket connection validates JWT.

Flow:

```txt
Socket Connect
      │
      ▼
JWT Verification
      │
      ▼
Join Authorized Rooms
```

---

# Room-Based Design

Users join rooms:

```txt
user:<userId>
restaurant:<restaurantId>
```

Benefits:

- targeted events
- reduced traffic
- realtime efficiency

---

# Internal Event Broadcasting

Services communicate with realtime service using:

```txt
/api/v1/internal/emit
```

Protected using:

```txt
x-internal-key
```

---

# Why Internal Keys?

Prevents:

- fake service requests
- unauthorized events
- external abuse

---

# Admin Service Design

Admin Service directly accesses MongoDB collections.

Purpose:

- analytics
- verification
- monitoring

---

# Why Native MongoDB Driver?

For analytics workloads:

Native MongoDB driver is:

- lightweight
- faster
- aggregation-friendly

---

# Frontend Architecture

Frontend built using:

- React
- TypeScript
- Tailwind CSS

---

# Frontend Features

- protected routes
- role-based navigation
- global app context
- realtime socket handling
- search params handling

---

# Context API Design

I used React Context API for:

- authentication state
- user state
- cart state
- location state

---

# Why Context API?

Project scale was moderate.

Context API was sufficient without Redux complexity.

---

# Deployment Design

| Component | Platform |
|---|---|
| Services | Render |
| RabbitMQ | AWS EC2 |
| Database | MongoDB Cloud |
| Media | Cloudinary |

---

# Why Render?

Advantages:

- simple deployment
- fast setup
- good microservice support
- easy environment management

---

# Why EC2 for RabbitMQ?

I wanted infrastructure-level understanding.

So I manually deployed RabbitMQ on AWS EC2.

This helped me learn:

- server management
- queue setup
- distributed infrastructure

---

# Major Engineering Concepts Demonstrated

This project demonstrates:

- microservices
- distributed systems
- event-driven architecture
- realtime systems
- GeoSpatial queries
- queue-based workflows
- scalable backend design

---

# Final Interview Conclusion

The main goal of BiteShip was not just feature development.

The goal was building a backend architecture closer to real-world scalable systems.

I focused heavily on:

- service separation
- asynchronous communication
- realtime architecture
- scalability
- clean backend engineering practices