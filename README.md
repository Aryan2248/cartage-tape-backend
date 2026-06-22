# Cartage Tape Inventory Management System

A role-based REST API for tracking the physical location of data stored across cartridge (cartage) tapes — built as part of an ONGC internship assessment. Built with Spring Boot, Spring Security (JWT), and MongoDB.

This README is written for frontend integration — every endpoint includes the exact request body, headers, and response shape you'll need.

---

## Tech Stack

- **Java 17+ / Spring Boot 3**
- **Spring Security** — JWT-based stateless authentication
- **MongoDB** — via Spring Data MongoDB
- **Lombok** — boilerplate reduction
- **Springdoc OpenAPI (Swagger)** — interactive API docs
- **Maven**

---

## Project Structure

```
com.example.cartagetape
├── config/          # Security & Swagger configuration
├── controller/       # REST endpoints
├── dto/               # Request/response payloads
├── entity/            # MongoDB documents
├── exception/         # Custom exceptions + global handler
├── repository/        # Mongo repositories
├── security/          # JWT filter, JWT service, user details service
└── service/           # Business logic interfaces + impl
```

---

## Setup

### 1. Prerequisites
- Java 17+
- MongoDB running locally or a connection string (MongoDB Atlas works too)

### 2. Configuration
Add to `src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/cartagetape

jwt.secret=replace-with-a-long-random-base64-secret-key-min-256-bits
jwt.expiration=86400000

server.port=8080
```

`jwt.expiration` is in milliseconds (`86400000` = 24 hours).

### 3. Run
```bash
mvn spring-boot:run
```

App will be available at `http://localhost:8080`.

### 4. Swagger UI
Once running, visit:
```
http://localhost:8080/swagger-ui.html
```
Use the **Authorize** button to paste in your JWT (no need to type "Bearer", just the token) and test endpoints interactively.

---

## Authentication

All endpoints except `/api/auth/**` and Swagger paths require a JWT in the request header:

```
Authorization: Bearer <token>
```

There are two roles: `ADMIN` and `EMPLOYEE`. **Registration always creates an `EMPLOYEE`.** There is currently no public endpoint to create an `ADMIN` — see [Creating an Admin User](#creating-an-admin-user) below.

---

## API Reference

### Auth

#### Register
```
POST /api/auth/register
Content-Type: application/json
```
Body:
```json
{
  "name": "Aryan Sharma",
  "email": "aryan@ongc.com",
  "password": "password123"
}
```
Response `200 OK`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "aryan@ongc.com",
  "role": "EMPLOYEE"
}
```
Errors:
- `400` if email/password/name missing or invalid email format
- `409` if email already registered

#### Login
```
POST /api/auth/login
Content-Type: application/json
```
Body:
```json
{
  "email": "aryan@ongc.com",
  "password": "password123"
}
```
Response `200 OK`: same shape as register.

Errors:
- `401` invalid email or password

---

### Tapes

All tape endpoints require `Authorization: Bearer <token>`.

#### Create a tape — `ADMIN` or `EMPLOYEE`
```
POST /api/tapes
Content-Type: application/json
Authorization: Bearer <token>
```
Body:
```json
{
  "sequenceNumber": "CT-001",
  "location": "Rack A1",
  "size": "LTO-6",
  "remarks": "New cartridge tape"
}
```
Response `200 OK`:
```json
{
  "id": "665f1a2b3c4d5e6f7a8b9c0d",
  "sequenceNumber": "CT-001",
  "location": "Rack A1",
  "size": "LTO-6",
  "remarks": "New cartridge tape",
  "createdBy": "Aryan Sharma",
  "createdAt": "2026-06-22T18:30:00",
  "updatedBy": null,
  "updatedAt": null
}
```
`createdBy` is automatically set to the **name** of the logged-in user (resolved server-side from the JWT) — the frontend never needs to send this.

Errors:
- `409` if `sequenceNumber` already exists

#### Update a tape — `ADMIN` or `EMPLOYEE`
```
PUT /api/tapes/{id}
Content-Type: application/json
Authorization: Bearer <token>
```
Body: same shape as create.

Response `200 OK`: same shape as create, but `updatedBy` and `updatedAt` are now populated with the name/time of whoever made the update.

Errors:
- `404` if tape id doesn't exist
- `409` if changing to a `sequenceNumber` that already exists on another tape

#### Get all tapes (paginated) — `ADMIN` or `EMPLOYEE`
```
GET /api/tapes?page=0&size=10&sortBy=createdAt&direction=desc
Authorization: Bearer <token>
```
Query params (all optional):
| Param | Default | Notes |
|---|---|---|
| `page` | `0` | zero-indexed |
| `size` | `10` | page size |
| `sortBy` | `createdAt` | any field on the tape, e.g. `sequenceNumber`, `location` |
| `direction` | `desc` | `asc` or `desc` |
| `location` | — | filter by location (partial, case-insensitive) |

Example with filter:
```
GET /api/tapes?location=Rack&page=0&size=5
```

Response `200 OK`:
```json
{
  "content": [
    { "id": "...", "sequenceNumber": "CT-001", "location": "Rack A1", "size": "LTO-6", "remarks": "...", "createdBy": "Aryan Sharma", "createdAt": "...", "updatedBy": null, "updatedAt": null }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "number": 0,
  "size": 10
}
```
Use `content` for the list, `totalElements`/`totalPages`/`number` to build pagination controls.

#### Get tape by ID — `ADMIN` or `EMPLOYEE`
```
GET /api/tapes/{id}
Authorization: Bearer <token>
```
Response: single tape object (same shape as create response). `404` if not found.

#### Get tape by sequence number — `ADMIN` or `EMPLOYEE`
```
GET /api/tapes/sequence/{sequenceNumber}
Authorization: Bearer <token>
```
e.g. `GET /api/tapes/sequence/CT-001`. Same response shape. `404` if not found.

#### Delete a tape — `ADMIN` only
```
DELETE /api/tapes/admin/{id}
Authorization: Bearer <token>
```
Response `204 No Content` on success.

`403 Forbidden` if called with an `EMPLOYEE` token — this is enforced at the security-config level, not just in code.

---

## Error Response Format

All errors (validation, not-found, duplicate, bad credentials) return a consistent JSON shape:

```json
{
  "timestamp": "2026-06-22T18:30:00",
  "status": 404,
  "message": "Tape not found with id: 665f..."
}
```

Validation errors (e.g. missing required field) look slightly different, with a field-level map:
```json
{
  "timestamp": "2026-06-22T18:30:00",
  "status": 400,
  "errors": {
    "sequenceNumber": "must not be blank"
  }
}
```

| Status | Meaning |
|---|---|
| `400` | Validation failure or bad request |
| `401` | Invalid login credentials |
| `403` | Authenticated but not authorized for this role/route |
| `404` | Resource not found |
| `409` | Duplicate (email already registered / sequence number exists) |

---

## Roles & Access Summary

| Endpoint | EMPLOYEE | ADMIN |
|---|---|---|
| `POST /api/auth/register` | ✅ public | ✅ public |
| `POST /api/auth/login` | ✅ public | ✅ public |
| `POST /api/tapes` | ✅ | ✅ |
| `PUT /api/tapes/{id}` | ✅ | ✅ |
| `GET /api/tapes` | ✅ | ✅ |
| `GET /api/tapes/{id}` | ✅ | ✅ |
| `GET /api/tapes/sequence/{sequenceNumber}` | ✅ | ✅ |
| `DELETE /api/tapes/admin/{id}` | ❌ (403) | ✅ |

---

## Creating an Admin User

Since `/api/auth/register` always assigns `EMPLOYEE`, promote a user to `ADMIN` manually in MongoDB after registering normally:

```javascript
db.users.updateOne(
  { email: "admin@ongc.com" },
  { $set: { role: "ADMIN" } }
)
```

Then log in again with that account to get a fresh token with `ADMIN` privileges — JWT roles are baked in at login time via the user's current role in the database.

---

## Notes for Frontend Integration

- Tokens are stateless JWTs — store in memory or `httpOnly` cookie (avoid `localStorage` for production-grade security, though fine for a demo/internship project).
- `createdBy`/`updatedBy` are always names, never emails or IDs — display them as-is.
- `role` comes back from `/api/auth/login` and `/api/auth/register` — use it client-side to conditionally show the delete button (`ADMIN` only), though the backend enforces this regardless.
- Dates (`createdAt`, `updatedAt`) are ISO-8601 `LocalDateTime` strings with no timezone offset — treat as local server time.
