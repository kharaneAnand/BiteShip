# Auth Service API Documentation

# Overview

The Auth Service handles:

- Google OAuth authentication
- JWT generation
- User profile management
- Role assignment

---

# Base Route

```txt
/api/auth
```

---

# Authentication Flow

```txt
Frontend
   │
   ▼
Google OAuth
   │
   ▼
Auth Service
   │
   ▼
JWT Token Generated
```

---

# Routes

---

# 1. Login User

## Endpoint

```http
POST /api/auth/login
```

## Description

Authenticates user using Google OAuth authorization code.

---

## Request Body

```json
{
  "code": "google-auth-code"
}
```

---

## Success Response

```json
{
  "message": "Login Success",
  "token": "jwt-token",
  "user": {}
}
```

---

## Features

- Google OAuth integration
- Automatic user creation
- JWT token generation

---

# 2. Get My Profile

## Endpoint

```http
GET /api/auth/me
```

## Protected Route

```txt
Authorization: Bearer <token>
```

---

## Description

Returns authenticated user profile.

---

## Success Response

```json
{
  "_id": "user-id",
  "name": "Anand",
  "email": "example@gmail.com",
  "role": "customer"
}
```

---

# 3. Add User Role

## Endpoint

```http
PUT /api/auth/add/role
```

## Protected Route

```txt
Authorization: Bearer <token>
```

---

## Description

Assigns role to authenticated user.

---

## Supported Roles

```txt
customer
seller
rider
```

---

## Request Body

```json
{
  "role": "seller"
}
```

---

## Success Response

```json
{
  "user": {},
  "token": "updated-jwt-token"
}
```

---

# JWT Structure

```json
{
  "user": {
    "_id": "",
    "name": "",
    "email": "",
    "role": ""
  }
}
```

---

# Middleware

## isAuth

Validates:
- Authorization header
- JWT token
- User payload

---

# Security Features

- JWT Authentication
- Protected routes
- Role-based authorization
- Google OAuth verification

---

# Technologies Used

- Express.js
- JWT
- Google OAuth
- Axios

---

# Environment Variables

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
JWT_SEC=
```

---

# Service Responsibilities

The Auth Service is responsible for:

- User authentication
- Identity verification
- Token generation
- User authorization state