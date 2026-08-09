# E-Commerce Backend API

A production-oriented REST API for an e-commerce platform built with **Node.js**, **Express**, and **MongoDB (Mongoose)**. It provides authentication (JWT + rotating refresh tokens with DB-backed sessions), category & product management, a user cart, and an order/checkout flow.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
  - [Request Lifecycle](#request-lifecycle)
  - [Authentication & Sessions](#authentication--sessions)
  - [Authorization / Roles](#authorization--roles)
  - [Soft Deletes](#soft-deletes)
  - [Order Flow](#order-flow)
- [Data Models](#data-models)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Running the Server](#running-the-server)
- [API Reference](#api-reference)
  - [Auth](#auth)
  - [Categories](#categories)
  - [Products](#products)
  - [Cart](#cart)
  - [Orders](#orders)
  - [Test / Me](#test--me)
- [Notes & Known Issues](#notes--known-issues)

---

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Runtime    | Node.js (ES Modules, `"type": "module"`) |
| Framework  | Express `^5.2.1` |
| Database   | MongoDB Atlas (Mongoose `^9.8.1`) |
| Auth       | `jsonwebtoken` (JWT access + refresh), httpOnly cookies |
| Hashing    | Node `crypto` (SHA-256) |
| Other      | `cookie-parser`, `cors` (installed), `morgan` (logging), `dotenv`, `nodemon` (dev) |

> **Note:** `bcryptjs` and `cors` are listed as dependencies but are **not currently used** in the code. Passwords are hashed with SHA-256 via the built-in `crypto` module.

---

## Features

- **Authentication**
  - Register & login with SHA-256 hashed passwords
  - Short-lived **access tokens** (JWT, ~10–15 min)
  - Long-lived **refresh tokens** (JWT, 7 days) stored in an **httpOnly, secure, SameSite=Strict** cookie
  - Refresh-token **rotation** (a new hash is stored on every refresh)
  - Server-side **session tracking** (IP + User-Agent, revocable)
  - Single logout (`/logout`) and logout from all devices (`/logout-all`)
- **Roles & Authorization** — `customer` and `admin` roles; admin-only write operations
- **Categories** — CRUD with soft delete and unique names
- **Products** — CRUD, search, category/price filters, sorting, pagination, soft delete
- **Cart** — per-user cart, add/update/remove/clear items
- **Orders** — place order from cart, buy-now, cancel, status & payment tracking (COD only)
- **Validation** — inline field-level validation with detailed error responses

---

## Project Structure

```
project/
├── .gitignore
├── password                     
└── Backend/
    ├── .env                      # Environment variables (gitignored)
    ├── package.json
    ├── server.js                 # Entry point — connects DB and starts HTTP server
    └── src/
        ├── app.js                # Express app: middleware + router mounting
        ├── config/
        │   ├── config.js         # Loads & validates env vars (MONGO_URI, JWT_SECRET)
        │   └── database.js       # Mongoose connection
        ├── middleware/
        │   ├── auth.middleware.js    # authenticate — verifies access token + session
        │   └── admin.middleware.js   # authorizeAdmin — role check
        ├── models/
        │   ├── users.model.js
        │   ├── session.model.js
        │   ├── category.model.js
        │   ├── product.model.js
        │   ├── cart.model.js
        │   └── order.model.js
        ├── controllers/
        │   ├── auth.controller.js
        │   ├── category.controller.js
        │   ├── product.controller.js
        │   ├── cart.controller.js
        │   └── order.controller.js
        └── routes/
            ├── auth.routes.js
            ├── category.routes.js
            ├── product.routes.js
            ├── cart.routes.js
            ├── order.routes.js
            └── test.routes.js
```

---

## Architecture Overview

The project follows a classic **layered architecture**:

```
HTTP Request
   │
   ▼
server.js (listens on PORT)
   │
   ▼
src/app.js (Express app — middleware: json, morgan, cookie-parser)
   │
   ▼
Routes (src/routes/*) — maps URLs to controllers
   │
   ▼
Middleware — authenticate / authorizeAdmin (only where required)
   │
   ▼
Controllers (src/controllers/*) — business logic & validation
   │
   ▼
Models (src/models/*) — Mongoose schemas → MongoDB collections
```

### Request Lifecycle

1. `server.js` calls `connectDB()` then starts listening on `process.env.PORT`.
2. `app.js` applies global middleware: `express.json()` for JSON bodies, `morgan` for request logging, and `cookie-parser` for reading cookies.
3. Requests are routed to the correct router under `/api/*`.
4. Protected routes run `authenticate` (JWT + session check) and, for admin writes, `authorizeAdmin`.
5. The controller performs validation and DB operations, then returns a JSON response.

### Authentication & Sessions

The auth system uses **two tokens + a DB session**:

1. **Register / Login** — after verifying credentials, the server:
   - Creates a **refresh token** (JWT, `7d`) and stores a SHA-256 **hash** of it in the `session` collection along with the user's IP and User-Agent.
   - Sets the refresh token as an **httpOnly cookie** (`refreshToken`).
   - Returns a short-lived **access token** (JWT, `10–15m`) in the JSON body containing `{ id, sessionId }`.
2. **Every protected request** — `authenticate` middleware:
   - Reads the `Authorization: Bearer <accessToken>` header.
   - Verifies the JWT signature.
   - Confirms the session still exists and is `revoked: false`.
   - Loads the user and attaches `req.user` and `req.session`.
3. **Refresh** — when the access token expires, the client calls `/api/auth/refresh-token`:
   - The server verifies the cookie refresh token, finds the matching non-revoked session, **rotates** the refresh token (new hash saved), and issues a fresh access token.
4. **Logout** — marks the session `revoked: true` and clears the cookie.
5. **Logout-all** — revokes every active session for the user.

> Cookies are set with `secure: true`, so they will **not** be sent over plain HTTP (localhost `http://`). Use HTTPS (e.g., `https://localhost` or a tunnel) when testing auth flows in a browser.

### Authorization / Roles

- Every user has a `role`: `"customer"` (default) or `"admin"`.
- `authorizeAdmin` is applied on top of `authenticate` for all **write** operations on categories, products, and order status/payment updates.
- Admin-only endpoints return `403` for customers.

### Soft Deletes

Categories and products are **not physically deleted**. Instead, `isActive` is set to `false`:
- List endpoints only return `isActive: true` records.
- Fetching a deactivated product returns `400 "Product is already deleted"`.

### Order Flow

- **Place order** (`POST /api/orders`): validates the shipping address + phone/pincode, checks payment method is `COD`, validates stock, snapshots item name/price into the order, decrements stock, clears the cart.
- **Buy now** (`POST /api/orders/buy-now`): same validation but for a single product directly.
- **Cancel** (`PATCH /api/orders/:id/cancel`): only allowed by the order owner and only while status is `Pending` (not Shipped/Confirmed/Cancelled). Stock is restored.
- **Admin status updates** (`PATCH /api/orders/:id/status`): `Pending | Confirmed | Shipped | Delivered | Cancelled`.
- **Payment** (`PATCH /api/orders/:id/payment`): only for COD orders marked `Delivered`, toggles `paymentStatus`.

---

## Data Models

### users
| Field     | Type    | Notes                         |
|-----------|---------|-------------------------------|
| fullName  | String  | required                      |
| email     | String  | required, unique              |
| password  | String  | required (SHA-256 hash)       |
| role      | String  | enum `customer`/`admin`, default `customer` |

### session
| Field            | Type     | Notes                                    |
|------------------|----------|------------------------------------------|
| user             | ObjectId | ref `users`, required                    |
| refreshTokenHash | String   | required                                 |
| ip               | String   | required                                 |
| userAgent        | String   | required                                 |
| revoked          | Boolean  | default `false`                          |
| timestamps       | —        | auto `createdAt`/`updatedAt`             |

### category
| Field    | Type    | Notes                                   |
|----------|---------|-----------------------------------------|
| name     | String  | required, unique, trimmed, lowercased   |
| image    | String  | default `""`                            |
| isActive | Boolean | default `true` (soft delete)            |
| timestamps | —     | auto                                    |

### products
| Field       | Type     | Notes                                   |
|-------------|----------|-----------------------------------------|
| name        | String   | required, trimmed                       |
| description | String   | required, trimmed                       |
| price       | Number   | required, min `0`                       |
| stock       | Number   | required, min `0`, default `0`          |
| brand       | String   | optional                                |
| images      | [String] | optional array                          |
| category    | ObjectId | ref `category`, required                |
| isActive    | Boolean  | default `true` (soft delete)            |
| timestamps  | —        | auto                                    |

### Cart
| Field    | Type                    | Notes                             |
|----------|-------------------------|-----------------------------------|
| user     | ObjectId               | ref `users`, required, **unique** (one cart per user) |
| items    | [{ product, quantity }]| product ref `products`; quantity int ≥ 1 |

### orders
| Field          | Type     | Notes                                    |
|----------------|----------|------------------------------------------|
| user           | ObjectId | ref `users`, required                    |
| items          | array    | snapshot: product ref, name, price, quantity, itemTotal |
| totalAmount    | Number   | required                                 |
| status         | String   | enum `Pending/Confirmed/Shipped/Delivered/Cancelled`, default `Pending` |
| paymentMethod  | String   | enum `COD`, default `COD`                |
| paymentStatus  | String   | enum `Pending/Paid/Failed`, default `Pending` |
| shippingAddress| object   | fullName, phoneNo (10 digits), addressLine, city, state, pincode (6 digits) |

---

## Environment Variables

Create a `.env` file inside `Backend/` with the following variables:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=<a-long-random-secret-string>
```

| Variable     | Required | Purpose                                       |
|--------------|----------|-----------------------------------------------|
| `PORT`       | No*      | Port the server listens on (`server.js`)       |
| `MONGO_URI`  | **Yes**  | MongoDB connection string (`config.js` throws if missing) |
| `JWT_SECRET` | **Yes**  | Secret used to sign/verify JWTs (`config.js` throws if missing) |

\* `PORT` is not validated by `config.js`, but the server will fail to listen if it's missing.

> **Security:** `MONGO_URI` and `JWT_SECRET` are secrets. Do **not** commit `.env` or the `password` file. The `.gitignore` already excludes `password`, `Backend/.env`, and `Backend/node_modules/`.

---

## Local Setup

### Prerequisites

- **Node.js** (v18+ recommended — the project uses ES Modules and modern syntax)
- **npm** (comes with Node)
- A **MongoDB** database — MongoDB Atlas (as used here) or a local instance

### Steps

1. **Clone the repository** and enter the project directory:

   ```bash
   git clone https://github.com/kunalghodela58625/Kharido.git
   cd Kharido
   ```

2. **Install dependencies** (from inside `Backend/`):

   ```bash
   cd Backend
   npm install
   ```

3. **Create the environment file:**

   ```bash
   cp .env.example .env   # if an example exists
   ```

   Otherwise, create `Backend/.env` manually with the variables listed in [Environment Variables](#environment-variables).

4. **Add a custom DNS note (optional):** `server.js` overrides Node's DNS servers with Google's `8.8.8.8` / Cloudflare's `1.1.1.1` to help with MongoDB Atlas resolution. If you don't need this, remove the first two lines of `server.js`.

---

## Running the Server

From inside `Backend/`:

```bash
# Development (auto-restart on changes)
npm run dev

# Production
node server.js
```

You should see:
```
connected DB
server is currently running
```

Verify it works by visiting <http://localhost:5000/> — it returns:

```
this is the message from backend
```

---

## API Reference

Base URL: `http://localhost:5000`

All endpoints return JSON. Authentication uses `Authorization: Bearer <accessToken>` headers; the refresh token is sent automatically as an httpOnly cookie.

### Auth

All routes are prefixed with `/api/auth`.

| Method | Endpoint            | Auth | Description                                  |
|--------|---------------------|------|----------------------------------------------|
| POST   | `/api/auth/register` | No   | Register a new user                          |
| POST   | `/api/auth/login`    | No   | Login, returns access token + sets cookie    |
| GET    | `/api/auth/getme`    | No*  | Fetch current user (`Authorization` header)  |
| GET    | `/api/auth/refresh-token` | Cookie | Rotate refresh token, issue new access token |
| GET    | `/api/auth/logout`   | Cookie | Logout current session (revoke + clear cookie) |
| GET    | `/api/auth/logout-all` | Cookie | Logout from all devices                   |

\* `getme` reads the token from the `Authorization` header directly (no middleware).

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{ "fullName": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
```
Response `201`: `{ message, user: { email, fullName }, accessToken }`

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{ "email": "jane@example.com", "password": "secret123" }
```
Response `200`: `{ message, accessToken }`

### Categories

Prefix: `/api/categories`. Write ops require `admin`.

| Method | Endpoint                | Auth  | Description                |
|--------|-------------------------|-------|----------------------------|
| GET    | `/api/categories`       | Public | List active categories    |
| GET    | `/api/categories/:id`   | Public | Get single category       |
| POST   | `/api/categories`       | Admin | Create category           |
| PUT    | `/api/categories/:id`   | Admin | Update category           |
| DELETE | `/api/categories/:id`   | Admin | Soft-delete category      |

**Create** body: `{ "name": "Electronics", "image": "https://..." }` (name is lowercased and must be unique).

### Products

Prefix: `/api/products`. Write ops require `admin`.

| Method | Endpoint              | Auth  | Description                            |
|--------|-----------------------|-------|----------------------------------------|
| GET    | `/api/products`       | Public | List/search/filter/sort/paginate      |
| GET    | `/api/products/:id`   | Public | Get single product (with category)    |
| POST   | `/api/products`       | Admin | Create product                         |
| PUT    | `/api/products/:id`   | Admin | Update product                         |
| DELETE | `/api/products/:id`   | Admin | Soft-delete product                    |

**Query params for `GET /api/products`:**
| Param      | Values                              | Default |
|------------|-------------------------------------|---------|
| `search`   | string (regex on name, case-insensitive) | —    |
| `category` | category ObjectId                   | —       |
| `minPrice` | number                              | —       |
| `maxPrice` | number                              | —       |
| `sort`     | `price_asc`, `price_desc`, `newest` | `newest`|
| `page`     | integer ≥ 1                         | `1`     |
| `limit`    | integer 1–100                       | `10`    |

**Create** body:
```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse",
  "price": 999,
  "stock": 50,
  "brand": "Logitech",
  "images": ["https://..."],
  "category": "<category_id>"
}
```

### Cart

Prefix: `/api/cart`. All routes require authentication.

| Method | Endpoint            | Description                       |
|--------|---------------------|-----------------------------------|
| GET    | `/api/cart`         | Get user's cart + `cartTotal`     |
| POST   | `/api/cart`         | Add item to cart (creates cart if none) |
| PATCH  | `/api/cart/:id`     | Update quantity of a cart item (`:id` = product id) |
| DELETE | `/api/cart/:id`     | Remove item from cart (`:id` = product id) |
| DELETE | `/api/cart`         | Clear the entire cart             |

**Add item** body: `{ "productId": "<product_id>", "quantity": 2 }`

### Orders

Prefix: `/api/orders`. All routes require authentication.

| Method | Endpoint                       | Auth  | Description                     |
|--------|--------------------------------|-------|---------------------------------|
| POST   | `/api/orders`                  | User  | Place order from cart           |
| POST   | `/api/orders/buy-now`          | User  | Buy a single product directly   |
| GET    | `/api/orders/my-orders`        | User  | List current user's orders      |
| GET    | `/api/orders`                  | Admin | List all orders (with user info)|
| PATCH  | `/api/orders/:id/status`       | Admin | Update order status             |
| PATCH  | `/api/orders/:id/cancel`       | User  | Cancel own pending order        |
| PATCH  | `/api/orders/:id/payment`      | Admin | Update payment status           |

**Place order / Buy-now** body:
```json
{
  "shippingAddress": {
    "fullName": "Jane Doe",
    "phoneNo": 9876543210,
    "addressLine": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": 400001
  },
  "paymentMethod": "COD"
}
```
`buy-now` also requires `"productId"` and optional `"quantity"`.

### Test / Me

Prefix: `/api`.

| Method | Endpoint   | Auth | Description                          |
|--------|------------|------|--------------------------------------|
| GET    | `/api/me`  | Yes  | Return authenticated user + session  |

---

## Notes & Known Issues

- **Password hashing:** SHA-256 is used instead of a salted KDF like `bcrypt` (despite `bcryptjs` being installed). For a production app, switching to `bcrypt`/`argon2` is strongly recommended.
- **Cookie `secure: true`:** Auth cookies won't be stored over plain HTTP. Test with HTTPS or a reverse proxy.
- **`getme` bug:** If the token is invalid, the controller returns `401` but still executes the code below (`decoded` is referenced outside the try block), which can throw a `ReferenceError` and 500. Use `/api/me` (middleware-protected) as a reliable alternative.
- **Validation bug in `getProducts`:** The checks `pageNumber == NaN` never match because `NaN` never equals `NaN`; invalid `page`/`limit` values fall through to `skip`/`limit` instead of returning `400`.
- **`updateProduct` category check:** Uses `categoryModel.findById(id)` (the product's id) instead of the new `category` value, so category re-validation is effectively broken and the returned status on failure is `404`.
- **Order listing:** `orders.isEmpty` in `myOrders` is always `undefined` (arrays use `.length`), so an empty array is returned rather than a friendly message.
- **Payment status check:** `updatePaymentStatus` validates against `["failed","paid"]` (lowercase) while the schema enum is `Pending/Paid/Failed`, so sending `"paid"`/`"failed"` would pass validation but be rejected by Mongoose; sending `"Paid"`/`"Failed"` would be rejected by the controller check.
- **Admin seeding:** There is no seed script. To create an admin, manually set `role: "admin"` on a user document in MongoDB (or via the shell) after registering.
- **CORS:** The `cors` package is installed but not configured — cross-origin requests are not currently handled.
- **DNS override:** `server.js` forces DNS servers to `8.8.8.8`/`1.1.1.1`; this may fail on some restricted networks.
- **Logging:** The `console.log(req.body)` in `register` prints the full request body — remove before production to avoid logging sensitive data.
```
