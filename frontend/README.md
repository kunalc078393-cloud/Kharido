# Kharido — Frontend

The frontend for **Kharido**, an e-commerce platform. It is a single-page application (SPA) built with **React 19 + Vite**, using **Redux Toolkit** for state management, **React Router v7** for navigation, and **Tailwind CSS v4** for styling.

It talks to the Kharido Backend REST API (a Node.js/Express/MongoDB service) to handle authentication, product browsing, cart management, and order placement.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
  - [Request / Data Flow](#request--data-flow)
  - [State Management (Redux)](#state-management-redux)
  - [Authentication & Token Refresh](#authentication--token-refresh)
  - [Route Guarding](#route-guarding)
- [Routing & User Journey Map](#routing--user-journey-map)
- [Pages & Components](#pages--components)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Available Scripts](#available-scripts)
- [Notes & Known Issues](#notes--known-issues)

---

## Tech Stack

| Layer          | Technology                                             |
|----------------|--------------------------------------------------------|
| Framework      | React `^19.2` + React DOM                              |
| Build Tool     | Vite `^8.2` (`@vitejs/plugin-react`)                   |
| Language       | JavaScript (JSX, ES Modules)                           |
| Routing        | `react-router-dom` `^7.18` (BrowserRouter)             |
| State          | Redux Toolkit `^2.12` + `react-redux` `^9.3`           |
| HTTP Client    | `axios` `^1.19`                                        |
| Styling        | Tailwind CSS `^4.3` (via `@tailwindcss/vite`)          |
| Linting        | ESLint 10 (flat config) + react-hooks + react-refresh  |

---

## Features

- **Authentication** — register, login, logout with JWT access tokens + rotating refresh tokens stored in httpOnly cookies.
- **Session restore** — on app load, silently refreshes the access token, fetches the current user, and reloads the cart.
- **Product catalog** — paginated product listing and a product detail page with a multi-image gallery.
- **Category browsing** — home page hero carousel + "Shop by Category" slider.
- **Cart** — add-to-cart, cart badge with item count, view cart, clear cart.
- **Checkout** — multi-section accordion (summary → contact → address → payment → confirm) with client-side validation and a confirm modal. Payment is Cash-on-Delivery only.
- **Order history** — profile page lists the user's orders with expandable item details.
- **Route guarding** — protected routes redirect unauthenticated users to login; public routes redirect authenticated users home.
- **Shared UI states** — reusable `Loading`, `Error`/`ErrorMessage` popups, empty states.

---

## Project Structure

```
frontend/
├── .env                        # VITE_API_URL (gitignored)
├── eslint.config.js            # ESLint flat config
├── index.html                  # SPA entry HTML (mounts #root)
├── package.json
├── vite.config.js              # Vite + React + Tailwind plugins
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.jsx                # Entry point — Redux Provider + <App/>
    ├── App.jsx                 # Router setup + route definitions
    ├── index.css               # Tailwind import
    ├── assets/                 # Static images (logo, slides, welcome)
    ├── components/
    │   ├── AuthInitializer.jsx     # Bootstraps auth/cart on first load
    │   ├── MainLayout.jsx          # Navbar + Outlet + Footer wrapper
    │   ├── Navbar.jsx              # Logo, links, profile chip, cart badge, auth buttons
    │   ├── Footer.jsx
    │   ├── Card.jsx                # Product card (grid item)
    │   ├── Loading.jsx             # Full-screen spinner
    │   ├── Error.jsx               # Auto-dismiss toast popup (portal)
    │   ├── ErrorMessage.jsx        # Inline dismissible error alert
    │   ├── NoProductFound.jsx      # Empty-state component
    │   └── routes/
    │       ├── ProtectedRoute.jsx  # Blocks unauthenticated users
    │       └── PublicRoute.jsx     # Redirects authenticated users away
    ├── pages/
    │   ├── HomePage.jsx            # Hero, carousel, categories
    │   ├── ProductsPage.jsx        # Paginated product grid
    │   ├── ProductDetailsPage.jsx  # Single product + add to cart
    │   ├── CartPage.jsx            # Cart items, total, clear/checkout
    │   ├── OrderPage.jsx           # Checkout accordion + place order
    │   ├── UserProfilePage.jsx     # User info + order history
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   └── ProfilePage.jsx         # Stub/unused placeholder
    ├── services/                   # API layer (thin wrappers around axios)
    │   ├── api.js                  # Axios instance + interceptors
    │   ├── authServices.js         # login/register/logout/refresh/getMe
    │   ├── cartServices.js         # get/add/clear cart
    │   └── productsServices.js     # getProducts / getProductById
    └── store/
        ├── store.js                # configureStore (auth + cart reducers)
        └── slices/
            ├── authSlice.js        # auth thunks + state
            └── cartSlice.js        # cart thunks + state
```

---

## Architecture Overview

The frontend follows a **unidirectional data flow** common to Redux + React SPAs:

```
User Action (click / form submit)
        │
        ▼
  React Component (pages/)
        │  dispatches
        ▼
Redux Thunk (store/slices)   ───►  Service function (services/)
        │                                 │  axios instance
        │                                 ▼
        │                        Backend REST API (Node/Express)
        │                                 │
        └◄──────────────────── JSON response (data or error)
        ▼
Redux Slice (extraReducers updates state: loading / error / data)
        │
        ▼
useSelector in components ──► Re-render UI (loading / error / content)
```

### Request / Data Flow

1. A page/component calls a **Redux async thunk** (e.g. `login`, `addToCart`, `getProducts` is called directly, not via a thunk).
2. The thunk calls a **service function** in `src/services/` which wraps `axios`.
3. The single shared `api.js` axios instance:
   - Attaches `Authorization: Bearer <accessToken>` from the Redux store on every request.
   - Sends credentials via cookies (`withCredentials: true`) so the refresh-token cookie is forwarded.
   - On a `401` response, transparently tries to **refresh the access token** once and retries the original request.
4. The slice's `extraReducers` set `pending` (loading), `fulfilled` (data), or `rejected` (error) state.
5. Components read that state with `useSelector` and render loading/error/content accordingly.

> Note: `ProductsPage` and `HomePage` call the service layer (`getProducts`, `api.get("/categories")`) directly with local `useState` instead of going through Redux.

### State Management (Redux)

Store (`src/store/store.js`) combines two slices:

**`auth` slice** (`authSlice.js`) — fields: `user`, `accessToken`, `isAuthenticated`, `initialized`, `loading`, `error`.
- Thunks: `login`, `register`, `logout`, `refresh`, `getMe`.
- `initialized` is set only after the bootstrap in `AuthInitializer` finishes (success or failure), so guards know the session check is complete.

**`cart` slice** (`cartSlice.js`) — fields: `cart` (items + products), `cartTotal`, `loading`, `operatingCart`, `error`.
- Thunks: `getCart`, `addToCart` (calls `getCart` again after adding to re-sync), `clearCart`.

### Authentication & Token Refresh

Token strategy: short-lived **access token** (JWT in memory/Redux) + long-lived **refresh token** (httpOnly cookie set by backend).

1. On first load, `AuthInitializer` runs `refresh()` → `getMe()` → `getCart()`, then marks the store `initialized`.
2. `api.js` attaches the access token to the `Authorization` header on each request.
3. When an API call returns `401`, the response interceptor calls the `refresh` thunk **once** (a single shared `refreshPromise` prevents duplicate concurrent refreshes), stores the new access token, and replays the original request.
4. If refresh also fails, the error is rejected and the auth state is reset to logged-out.

### Route Guarding

- `ProtectedRoute` — if auth is not yet initialized, shows `Loading`; if not authenticated, redirects to `/login`; otherwise renders nested routes (`/cart`, `/profile`, `/checkout`).
- `PublicRoute` — if not initialized, shows `Loading`; if already authenticated, redirects to `/`; otherwise renders nested routes (`/login`, `/register`).
- `MainLayout` wraps pages with the shared `Navbar`/`Footer` and also blocks rendering until `initialized`.

---

## Routing & User Journey Map

Routes are defined in `src/App.jsx`.

| Path              | Route guard | Layout      | Page                        |
|-------------------|-------------|-------------|-----------------------------|
| `/`               | Public      | MainLayout  | HomePage                    |
| `/products`       | Public      | MainLayout  | ProductsPage                |
| `/products/:id`   | Public      | MainLayout  | ProductDetailsPage          |
| `/cart`           | Protected   | MainLayout  | CartPage                    |
| `/profile`        | Protected   | MainLayout  | UserProfilePage             |
| `/checkout`       | Protected   | MainLayout  | OrderPage                   |
| `/login`          | PublicRoute | —           | LoginPage                   |
| `/register`       | PublicRoute | —           | RegisterPage                |

### Guest (not logged in)

```
Land on /  ──►  AuthInitializer attempts silent login (fails, stays guest)
  │
  ├─ Browse: Home ─► Products (paginated) ─► Product Details
  │
  ├─ Click "Add to Cart"  ──► dispatch(addToCart) → 401 → refresh fails
  │                                  → error toast shown (no cart access)
  ├─ Visit /cart, /profile, /checkout  ──► redirect to /login
  └─ Login / Register ──► authenticated ──► redirect to /
```

### Authenticated user

```
AuthInitializer: refresh() → getMe() → getCart() → initialized=true
  │
  ├─ Home / Products / Product Details (browse as guest)
  │
  ├─ Add to Cart ──► cart badge count updates ──► CartPage (view, clear)
  │
  ├─ Proceed to Checkout ──► OrderPage
  │       ├─ Order Summary (collapsible)
  │       ├─ Contact Info    (fullName, phoneNo validation)
  │       ├─ Address Info    (address, city, state, pincode validation)
  │       ├─ Payment Method  (COD only)
  │       └─ Order Confirmation ──► Place Order ──► confirm modal
  │                                   └─ POST /orders ──► success popup ─► Home
  │
  ├─ Profile ──► user info + order history (expandable order details)
  └─ Logout ──► dispatch(logout) ──► /login
```

---

## Pages & Components

### Pages

| Page                  | Description                                                                        |
|-----------------------|------------------------------------------------------------------------------------|
| `HomePage`            | Hero banner, image carousel (prev/next + dot indicators), "Shop by Category" slider fetched from `GET /categories`. |
| `ProductsPage`        | Fetches `getProducts({ page, limit=3 })`; renders `Card` grid with Prev/Next pagination; `NoProductFound` when empty. |
| `ProductDetailsPage`  | Fetches single product by `:id`; image gallery with clickable thumbnails; Add to Cart + Buy Now buttons; shows stock/availability. |
| `CartPage`            | Reads cart from Redux; lists items, shows `cartTotal`; Clear Cart and Proceed to Checkout actions; empty-state CTA to products. |
| `OrderPage`           | Accordion checkout flow; validates shipping fields; confirm modal → `POST /orders` → success modal → navigate home. |
| `UserProfilePage`     | Shows user name/email from auth store; fetches and lists the user's orders (`GET /orders`) with expandable details. |
| `LoginPage` / `RegisterPage` | Forms with per-field validation and inline error messages; dispatch `login` / `register`. |

### Reusable components

| Component         | Purpose                                                                  |
|-------------------|--------------------------------------------------------------------------|
| `AuthInitializer` | Bootstraps auth + cart on mount (runs once, guarded by a ref).            |
| `MainLayout`      | Shared shell — `Navbar` + routed `Outlet` + `Footer`.                     |
| `Navbar`          | Logo, Home/Products/About links, profile chip (avatar initial + name), cart badge with total item count, Login/Register or Logout. |
| `Card`            | Product card → links to `/products/:id`.                                 |
| `Loading`         | Full-screen animated spinner used during initialization and fetches.      |
| `Error`           | Auto-dismissing toast rendered via `createPortal` (3s).                   |
| `ErrorMessage`    | Inline dismissible alert with optional auto-close `duration`.             |
| `NoProductFound`  | Empty state used on the products page and detail page fallback.           |
| `ProtectedRoute` / `PublicRoute` | Navigation guards described in [Route Guarding](#route-guarding). |

---

## Environment Variables

Create a `.env` file in the `frontend/` root:

```
VITE_API_URL=https://kharido-api.onrender.com/api
```

| Variable          | Required | Purpose                                                                 |
|-------------------|----------|-------------------------------------------------------------------------|
| `VITE_API_URL`    | **Yes**  | Base URL of the Backend API. Used by `api.js` as the axios `baseURL`.   |

> `VITE_`-prefixed variables are exposed to the client by Vite at build time. `.env` is gitignored at the repo root.

---

## Local Setup

### Prerequisites

- **Node.js** (v18+ recommended) and **npm**
- The **Kharido Backend** running (for real data). The default `.env` points to the deployed API at `https://kharido-api.onrender.com/api`.

### Steps

```bash
# 1. Enter the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Configure the API URL
#    (create .env with VITE_API_URL if not present — see above)

# 4. Start the dev server
npm run dev
```

Open the URL printed by Vite (default `http://localhost:5173`).

> **Auth note:** The backend sets refresh tokens as `secure` httpOnly cookies, so they are only sent over HTTPS. When running against a local backend over plain HTTP, login/session persistence may not work in the browser.

---

## Available Scripts

| Command            | Description                                  |
|--------------------|----------------------------------------------|
| `npm run dev`      | Start the Vite dev server with HMR.          |
| `npm run build`    | Build the production bundle to `dist/`.      |
| `npm run preview`  | Locally preview the production build.        |
| `npm run lint`     | Run ESLint (flat config) across the project. |

---

## Notes & Known Issues

- **`ProfilePage.jsx`** is a stub — the actual profile UI is `UserProfilePage.jsx` (`/profile` routes to `UserProfilePage`).
- **`RegisterPage`** submit only dispatches `register()` without passing `formData`, and its `handleChange` uses a literal `name` key — registration payload handling is incomplete.
- **`cartServices.js`** — `clear()` references an undefined `data` variable (would throw if it returned), and `update()` is an empty stub.
- **`Navbar`** accesses `cart.items.reduce(...)` directly — if `cart` is `null` it will throw; `cart` is only guaranteed after a successful `getCart`.
- **`ProductDetailsPage`** — `useEffect` has an empty dependency array (`[]`) and calls `getProductById(id)` once.
- **Home category slider** and **product list** use local `useState` instead of Redux, so state isn't shared across pages.
- **LoginPage "Register here"** and **RegisterPage "Login here"** links point to `/` and `/register` respectively, not to the matching page.
- **Cart** lacks quantity update/remove-item UI even though the backend supports `PATCH`/`DELETE /api/cart/:id`; `cartServices.js` has no `remove` function.
- **Buy Now** on `ProductDetailsPage` is a UI-only button with no handler.
- Some `console.log` debug statements remain throughout the code (e.g. `AuthInitializer`, `Navbar`, `ProductsPage`).
```