# Restaurant Service API Documentation

# Overview

The Restaurant Service is the core business service of BiteShip.

It manages:

- Restaurants
- Menu Items
- Cart
- Orders
- Addresses

---

# Base Route

```txt
/api
```

---

# Modules

```txt
Restaurant APIs
Menu APIs
Cart APIs
Order APIs
Address APIs
```

---

# Restaurant APIs

---

# 1. Create Restaurant

## Endpoint

```http
POST /api/restaurant/new
```

## Protected

```txt
Seller Only
```

---

## Form Data

```txt
name
description
phone
latitude
longitude
formattedAddress
file
```

---

## Features

- Restaurant image upload
- GeoJSON location storage
- Cloudinary integration

---

# 2. Fetch My Restaurant

## Endpoint

```http
GET /api/restaurant/my
```

## Description

Returns authenticated seller restaurant.

---

# 3. Update Restaurant Status

## Endpoint

```http
PUT /api/restaurant/status
```

## Description

Updates restaurant open/close status.

---

# 4. Update Restaurant

## Endpoint

```http
PUT /api/restaurant/update
```

---

# 5. Get Nearby Restaurants

## Endpoint

```http
GET /api/restaurant/all
```

---

## Query Params

```txt
latitude
longitude
search
```

---

## Features

- Nearby restaurant discovery
- Search filtering
- Geo-based queries

---

# Menu Item APIs

---

# 1. Add Menu Item

## Endpoint

```http
POST /api/item/new
```

## Protected

```txt
Seller Only
```

---

## Form Data

```txt
name
description
price
file
```

---

# 2. Get Restaurant Menu

## Endpoint

```http
GET /api/item/all/:id
```

---

# 3. Delete Menu Item

## Endpoint

```http
DELETE /api/item/:id
```

---

# 4. Toggle Item Availability

## Endpoint

```http
PUT /api/item/status/:id
```

---

# Cart APIs

---

# 1. Add To Cart

## Endpoint

```http
POST /api/cart/add
```

---

## Features

- Quantity increment
- Single restaurant restriction

---

# 2. Fetch Cart

## Endpoint

```http
GET /api/cart/all
```

---

## Returns

- Cart items
- Subtotal
- Quantity count

---

# 3. Increment Cart Item

## Endpoint

```http
PUT /api/cart/inc
```

---

# 4. Decrement Cart Item

## Endpoint

```http
PUT /api/cart/dec
```

---

# 5. Clear Cart

## Endpoint

```http
DELETE /api/cart/clear
```

---

# Address APIs

---

# 1. Add Address

## Endpoint

```http
POST /api/address/new
```

---

# 2. Get My Addresses

## Endpoint

```http
GET /api/address/all
```

---

# 3. Delete Address

## Endpoint

```http
DELETE /api/address/:id
```

---

# Order APIs

---

# 1. Create Order

## Endpoint

```http
POST /api/order/new
```

---

## Features

- Cart conversion to order
- Payment integration
- Delivery fee calculation

---

# 2. Fetch My Orders

## Endpoint

```http
GET /api/order/myorder
```

---

# 3. Fetch Single Order

## Endpoint

```http
GET /api/order/:id
```

---

# 4. Fetch Orders For Restaurant

## Endpoint

```http
GET /api/order/restaurant/:restaurantId
```

---

# 5. Update Order Status

## Endpoint

```http
PUT /api/order/:orderId
```

---

## Supported Status

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

# 6. Fetch Payment Order

## Endpoint

```http
GET /api/order/payment/:id
```

---

# 7. Assign Rider To Order

## Endpoint

```http
PUT /api/order/assign/rider
```

---

# 8. Rider Current Order

## Endpoint

```http
GET /api/order/current/rider
```

---

# 9. Rider Order Status Update

## Endpoint

```http
PUT /api/order/update/status/rider
```

---

# Database Features

## GeoJSON

Used for:
- Nearby restaurants
- Rider allocation

---

## TTL Indexes

Used for:
- Expiring unpaid orders

---

# Queue Communication

## Produces Events

```txt
ORDER_READY_QUEUE
```

## Consumes Events

```txt
PAYMENT_QUEUE
```

---

# Security

- JWT Authentication
- Seller authorization
- Internal service keys

---

# Technologies Used

- Express.js
- MongoDB
- Mongoose
- RabbitMQ
- Cloudinary

---

# Environment Variables

```env
MONGO_URI=
JWT_SEC=
UTILS_SERVICE=
RABBITMQ_URL=
REALTIME_SERVICE=
```

---

# Core Responsibilities

The Restaurant Service handles the main business logic of the platform including:

- Food ordering
- Restaurant management
- Menu management
- Cart workflows
- Order lifecycle
- Address management