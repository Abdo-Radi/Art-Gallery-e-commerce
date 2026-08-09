# Art Gallery E-commerce

A MERN-stack art gallery platform with three applications:

| App | Path | Stack | Default URL |
| --- | --- | --- | --- |
| API server | `server/` | Express 4 + Mongoose 8 (MongoDB Atlas) | http://localhost:3002 |
| Storefront (customers) | `front-office/` | React 18 + Vite + Redux Toolkit + shadcn/ui | http://localhost:5173 |
| Admin dashboard | `back-office/` | React 18 + Vite + Redux Toolkit + TailAdmin-style UI | http://localhost:5174 |

There is also an optional Flask chatbot service in `server/helpers/` used by the storefront chat widget.

## Setup

### 1. API server

```bash
cd server
npm install
cp .env.example .env   # then fill in real values
node server.js
```

`.env` variables:

- `PORT` — API port (default 3002)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — long random string used to sign JWTs

> **Security note:** `.env` was previously committed to git history with live
> credentials. It is now git-ignored, but the old values remain in history —
> **rotate the MongoDB Atlas password and the JWT secret**, and consider
> rewriting history or treating the old credentials as burned.

### 2. Storefront (front-office)

```bash
cd front-office
npm install
npm run dev
```

Optional `.env` (see `.env.example`): `VITE_API_URL`, `VITE_CHATBOT_URL`.

### 3. Admin dashboard (back-office)

```bash
cd back-office
npm install
npm run dev -- --port 5174
```

Optional `.env` (see `.env.example`): `VITE_API_URL`.

The CORS whitelist in `server/app.js` allows `http://localhost:5173` and
`http://localhost:5174`, so run the storefront on 5173 and the admin app on 5174.

Admin accounts cannot be self-registered; create the first one directly in the
database or temporarily via an existing admin, then sign in at `/admin/login`.

### 4. Chatbot service (optional)

```bash
cd server/helpers
pip install -r requirements.txt
python flaskapi.py   # serves POST /chat on port 5000
```

The storefront chat widget calls `http://localhost:5000/chat` (configurable via
`VITE_CHATBOT_URL`). Answers come from semantic matching against
`helpers/data.json`.

## API overview

All routes are mounted under `/v1`. Public: `POST /register` (customer/artist
only), `POST /login`, `GET /artworks`, `GET /exhibitions`, `GET /categories`,
`GET /tickets`. Authenticated (JWT `Authorization: Bearer <token>`): cart
routes, order/payment creation. Admin-only: all other CRUD (admins, artists,
customers, categories, exhibitions, tickets, orders, payments, cards, stats).

## Payments

The checkout flow is a demo: card details are validated client-side only and
never stored; an order (`status: "Paid"`) and a payment record are created, and
the cart is cleared. Do not use it with real card data.
