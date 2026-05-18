# Database Design Documentation

# Overview

BiteShip uses MongoDB as the primary database.

The platform follows a distributed microservice architecture where multiple services interact with shared collections while maintaining independent business responsibilities.

---

# Database Technology

```txt
MongoDB Atlas / MongoDB Cloud
```

---

# Database Name

```txt
BiteShip
```

---

# Why MongoDB?

MongoDB was selected because:

- Flexible schema support
- Fast development speed
- Excellent geospatial support
- Easy scaling
- Perfect fit for microservices
- Efficient document relationships

---

# Collections Overview

The platform contains the following major collections:

| Collection | Purpose |
|---|---|
| users | User authentication & profiles |
| restaurants | Restaurant partner data |
| menuitems | Restaurant food items |
| carts | Customer cart management |
| addresses | Delivery addresses |
| orders | Order lifecycle management |
| riders | Rider profiles & availability |

---

# User Collection

# Purpose

Stores authenticated users.

---

# Important Fields

```ts
{
  name,
  email,
  image,
  role,
  restaurantId
}
```

---

# Supported Roles

```txt
customer
seller
rider
admin
```

---

# Design Advantages

- Single authentication system
- Easy role switching
- JWT-friendly structure

---

# Restaurant Collection

# Purpose

Stores restaurant partner details.

---

# Important Fields

```ts
{
  name,
  description,
  image,
  ownerId,
  phone,
  isVerified,
  autoLocation,
  isOpen
}
```

---

# GeoSpatial Design

Restaurants use:

```txt
GeoJSON Point
```

---

# Coordinates Format

```ts
[longitude, latitude]
```

---

# Geo Index

```ts
schema.index({ autoLocation: "2dsphere" })
```

---

# Benefits

- Nearby restaurant search
- Distance calculations
- Fast geospatial queries

---

# MenuItem Collection

# Purpose

Stores restaurant menu items.

---

# Important Fields

```ts
{
  restaurantId,
  name,
  description,
  image,
  price,
  isAvailable
}
```

---

# Business Features

- Dynamic menu management
- Availability toggling
- Restaurant isolation

---

# Cart Collection

# Purpose

Stores customer cart items.

---

# Important Fields

```ts
{
  userId,
  restaurantId,
  itemId,
  quantity
}
```

---

# Compound Unique Index

```ts
{
  userId: 1,
  restaurantId: 1,
  itemId: 1
}
```

---

# Why Compound Index?

Prevents duplicate cart entries.

Instead of:

```txt
Same item added multiple times
```

the quantity increases automatically.

---

# Single Restaurant Constraint

The system enforces:

```txt
One restaurant order at a time
```

This simplifies:

- Delivery handling
- Payment processing
- Rider assignment

---

# Address Collection

# Purpose

Stores customer delivery addresses.

---

# Important Fields

```ts
{
  userId,
  mobile,
  formattedAddress,
  location
}
```

---

# GeoSpatial Support

Addresses also use:

```txt
GeoJSON Point
```

for future optimizations like:

- Nearby rider allocation
- Delivery calculations
- Smart routing

---

# Rider Collection

# Purpose

Stores delivery partner details.

---

# Important Fields

```ts
{
  userId,
  picture,
  phoneNumber,
  aadharNumber,
  drivingLicenseNumber,
  isVerified,
  location,
  isAvailable
}
```

---

# Rider Geo Index

```ts
schema.index({ location: "2dsphere" })
```

---

# Purpose of Rider Location

Used for:

- Nearby rider search
- Real-time assignment
- Delivery optimization

---

# Order Collection

# Purpose

Stores complete order lifecycle data.

---

# Important Fields

```ts
{
  userId,
  restaurantId,
  riderId,
  items,
  totalAmount,
  deliveryAddress,
  status,
  paymentMethod,
  paymentStatus
}
```

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

# Embedded Snapshot Strategy

Orders store:

- item names
- prices
- quantities
- delivery address

inside the order itself.

---

# Why Snapshot Data?

Prevents historical corruption if:

- menu changes
- prices change
- addresses update

after order placement.

---

# TTL Expiration Strategy

Orders include:

```ts
expiresAt
```

with:

```ts
expireAfterSeconds: 0
```

---

# Purpose

Automatically removes:

```txt
Expired unpaid orders
```

---

# Benefits

- Prevents stale orders
- Reduces cleanup logic
- Improves system hygiene

---

# Database Relationships

# User → Restaurant

```txt
One Seller → One Restaurant
```

---

# Restaurant → MenuItems

```txt
One Restaurant → Multiple Menu Items
```

---

# User → Cart

```txt
One User → Multiple Cart Items
```

---

# User → Orders

```txt
One User → Multiple Orders
```

---

# Rider → Orders

```txt
One Rider → Multiple Deliveries
```

---

# Geospatial Features

MongoDB geospatial queries power:

- Nearby restaurant discovery
- Rider allocation
- Real-time delivery systems

---

# Example Geo Query

```ts
$near: {
  $geometry: location,
  $maxDistance: 1500
}
```

---

# Performance Optimizations

# Indexes Used

| Collection | Index |
|---|---|
| restaurants | 2dsphere |
| riders | 2dsphere |
| carts | compound unique |
| orders | TTL index |

---

# Scalability Considerations

The schema is optimized for:

- High read performance
- Real-time updates
- Event-driven architecture
- Microservice separation

---

# Microservice Ownership

| Service | Collections |
|---|---|
| Auth Service | users |
| Restaurant Service | restaurants, menuitems, carts, orders, addresses |
| Rider Service | riders |
| Admin Service | analytics access |
| Utils Service | external integrations |

---

# Future Improvements

Future database improvements may include:

- Read replicas
- Sharding
- Redis caching
- ElasticSearch
- Analytics warehouse
- Event sourcing

---

# Database Design Strengths

The BiteShip database architecture provides:

- Scalability
- Flexibility
- Real-time support
- GeoSpatial optimization
- High availability
- Microservice compatibility
- Fast delivery workflows