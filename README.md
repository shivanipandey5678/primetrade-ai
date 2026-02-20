

Product app with **backend** (Node + Express + MongoDB) and **frontend** (React + Vite). Users can register/login, view products, and add/remove favorites.

---

## Project structure

```
Primetrade.ai/
├── backend/          # Express API (auth, products, favorites)
├── frontend/
│   └── frontend/     # React + Vite app
└── README.md
```

---

## Backend setup

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** (local or Atlas)

### 1. Install & env

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=8008
MONGODB_URL=mongodb://127.0.0.1:27017/primetrade_db
JWT_Secret=your-secret-key
SALT=10
```

### 2. Run backend

```bash
npm start
```

Server: **http://localhost:8008**  
Health: `GET http://localhost:8008/` → `"healthy...."`

### 3. Seed data (optional)

```bash
npm run seed
```

Adds sample users and products.

---

## Frontend setup

### 1. Install

```bash
cd frontend/frontend
npm install
```

### 2. Env

Create `frontend/frontend/.env`:

```env
VITE_API_URL=http://localhost:8008
```

(No spaces around `=`)

### 3. Run frontend

```bash
npm run dev
```

App: **http://localhost:5173**

---

## API overview

Base URL: `http://localhost:8008`

### Auth (no token)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/register` | `{ name, email, password }` | Register → returns user + token |
| POST | `/api/v1/auth/login` | `{ email, password }` | Login → returns user + token |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/products` | No | List products. Query: `page`, `limit`, `search` |
| GET | `/api/v1/products/:id` | No | Single product |
| POST | `/api/v1/products/add` | Yes | Create product (body: title, description, price, image) |
| PUT | `/api/v1/products/update` | Yes | Update product (body: id, title, description, price, image) |
| DELETE | `/api/v1/products/delete` | Yes | Delete product (body: `{ id }`) |
| POST | `/api/v1/products/:id/favorite` | Yes | Add to favorites |
| DELETE | `/api/v1/products/:id/favorite` | Yes | Remove from favorites |

**Auth:** Send header `Authorization: Bearer <token>` on protected routes.

---

## Quick run (both)

1. Start MongoDB.
2. **Terminal 1:** `cd backend` → `npm start`
3. **Terminal 2:** `cd frontend/frontend` → `npm run dev`
4. Open **http://localhost:5173** → Register/Login → browse products and favorites.

---

## License

ISC
