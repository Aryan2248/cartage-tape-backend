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
├── config/          # Security, CORS, Swagger config, default admin seeder
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

This repo ships an `application.properties.example` instead of a real `application.properties` — the real file is gitignored so secrets never get committed.

Copy it and fill in your own values:
```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/cartagetape

jwt.secret=replace-with-a-long-random-base64-secret-key-min-256-bits
jwt.expiration=86400000

server.port=8080

admin.default.name=System Admin
admin.default.email=admin@ongc.com
admin.default.password=Admin@123
```

`jwt.expiration` is in milliseconds (`86400000` = 24 hours). The `admin.default.*` values are used once on startup — see [Default Admin Account](#default-admin-account) below.

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

### 5. CORS (for frontend integration)
The API allows cross-origin requests from `http://localhost:3000` and `http://localhost:5173` by default (see `SecurityConfig.corsConfigurationSource()`). If your frontend runs on a different port, add it to the `setAllowedOrigins(...)` list in `SecurityConfig.java`.

---

## Default Admin Account

On first startup, `AdminSeeder` automatically creates an admin user using the `admin.default.*` values in `application.properties` — **if no user with that email already exists**. No manual database editing required.

Default login (unless you changed it):
```json
{
  "email": "admin@ongc.com",
  "password": "Admin@123"
}
```
Change the password in your local `application.properties` before deploying or sharing this anywhere public.

This default admin is also the **only way to get started**, since there is no public registration anymore — see below.

---

## Authentication

There is **no public registration**. Account creation is admin-controlled.

All endpoints except `/api/auth/login` and Swagger paths require a JWT in the request header:

```
Authorization: Bearer <token>
```

There are two roles: `ADMIN` and `EMPLOYEE`.

| Endpoint | Access |
|---|---|
| `POST /api/auth/login` | Public — anyone with valid credentials |
| `POST /api/auth/register` | **ADMIN only** — used to create new employee or admin accounts |

This means: a new employee never signs themselves up. An admin creates the account first (via `/api/auth/register`), and the employee then logs in with the credentials the admin set up.

---

## API Reference

### Auth

#### Register a new user — `ADMIN` only
```
POST /api/auth/register
Content-Type: application/json
Authorization: Bearer <adminToken>
```
Body:
```json
{
  "name": "Aryan Sharma",
  "email": "aryan@ongc.com",
  "password": "password123",
  "role": "EMPLOYEE"
}
```
`role` is optional — if omitted, it defaults to `EMPLOYEE`. Set it to `"ADMIN"` to create another admin account.

Response `200 OK` — **no token is returned here**, since the admin is creating an account for someone else, not logging in as them:
```json
{
  "name": "Aryan Sharma",
  "email": "aryan@ongc.com",
  "role": "EMPLOYEE"
}
```
Errors:
- `400` if email/password/name missing or invalid email format
- `403` if called without an `ADMIN` token (or no token at all)
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
Response `200 OK`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "aryan@ongc.com",
  "role": "EMPLOYEE"
}
```
Errors:
- `401` invalid email or password

#### Get current user
```
GET /api/auth/me
Authorization: Bearer <token>
```
Response `200 OK`:
```json
{
  "name": "Aryan Sharma",
  "email": "aryan@ongc.com",
  "role": "EMPLOYEE"
}
```
Use this on app load to identify the logged-in user and their role (e.g. to conditionally show the admin panel or delete button) without decoding the JWT on the client.

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

#### Get all tapes (paginated, filterable, searchable) — `ADMIN` or `EMPLOYEE`
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
| `location` | — | filter by location only (partial, case-insensitive) |
| `search` | — | global search across `sequenceNumber`, `location`, and `remarks` — takes priority over `location` if both are sent |

Examples:
```
GET /api/tapes?location=Rack&page=0&size=5
GET /api/tapes?search=CT-001&page=0&size=10
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

| Endpoint | Public | EMPLOYEE | ADMIN |
|---|---|---|---|
| `POST /api/auth/login` | ✅ | ✅ | ✅ |
| `POST /api/auth/register` | ❌ | ❌ (403) | ✅ |
| `GET /api/auth/me` | ❌ | ✅ | ✅ |
| `POST /api/tapes` | ❌ | ✅ | ✅ |
| `PUT /api/tapes/{id}` | ❌ | ✅ | ✅ |
| `GET /api/tapes` (incl. search/filter) | ❌ | ✅ | ✅ |
| `GET /api/tapes/{id}` | ❌ | ✅ | ✅ |
| `GET /api/tapes/sequence/{sequenceNumber}` | ❌ | ✅ | ✅ |
| `DELETE /api/tapes/admin/{id}` | ❌ | ❌ (403) | ✅ |

---

## Testing with Postman

A ready-to-import collection is included: `cartage-tape-inventory.postman_collection.json`.

1. Import it into Postman.
2. It includes a collection variable `baseUrl` (defaults to `http://localhost:8080`) and `token` (auto-filled).
3. Run **Auth → Login as Admin** first (uses the seeded default admin credentials) — a test script automatically saves the returned JWT into the `token` variable.
4. Run **Auth → Register** while the admin token is active to create a new employee account.
5. Run **Auth → Login** with that employee's credentials to get their own token for the rest of the requests.
6. For `Update Tape`, `Get Tape By ID`, and `Delete Tape`, replace `REPLACE_WITH_TAPE_ID` in the URL with a real id from a create/list response.

---

## Notes for Frontend Integration

- There is **no sign-up page** in this system. Only an `ADMIN` can create new accounts via `/api/auth/register`, so the frontend needs a "Create User" form available only inside an admin view — not a public registration form.
- Tokens are stateless JWTs — store in memory or `httpOnly` cookie (avoid `localStorage` for production-grade security, though fine for a demo/internship project).
- Call `GET /api/auth/me` right after login (or on app load if a token is already stored) to get the current user's name/email/role — use `role` to conditionally show admin-only UI like "Create User" and the delete button.
- `createdBy`/`updatedBy` are always names, never emails or IDs — display them as-is.
- Dates (`createdAt`, `updatedAt`) are ISO-8601 `LocalDateTime` strings with no timezone offset — treat as local server time.
- Use the `search` query param for a single search box (matches sequence number, location, or remarks); use `location` only if you need a dedicated location filter separate from general search.
