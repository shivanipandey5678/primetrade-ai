# Primetrade.ai – Task API (Backend + React Frontend)

REST API with JWT auth and role-ready structure, plus a React frontend for register, login, and tasks CRUD.

---

## Project structure

- **`backend/`** – Express + MongoDB, auth & tasks APIs
- **`frontend/`** – React (Vite) app – register, login, dashboard, tasks CRUD

---

## Backend setup

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas connection string)

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Environment variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URL=mongodb://localhost:27017/primetrade
JWT_Secret=your-secret-key
SALT=10
```

- `PORT` – server port (default 5000)
- `MONGODB_URL` – MongoDB connection string
- `JWT_Secret` – secret for signing JWT
- `SALT` – bcrypt salt rounds (e.g. 10)

### 3. Run backend

```bash
npm start
```

Server runs at `http://localhost:5000`. Health check: `GET http://localhost:5000/` → `"healthy...."`.

---

## Frontend setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. API base URL

The frontend calls the backend using **`VITE_API_BASE`**.

- A **`frontend/.env`** file is already set for local backend:

```env
VITE_API_BASE=http://localhost:5000/api/v1
```

- If your backend is on another port or host, edit `frontend/.env` and set:

```env
VITE_API_BASE=http://localhost:YOUR_PORT/api/v1
```

- For production, set the full backend URL, e.g.:

```env
VITE_API_BASE=https://your-api.com/api/v1
```

You can copy `frontend/.env.example` to `frontend/.env` and change the value there.

### 3. Run frontend (dev)

```bash
npm run dev
```

App opens at `http://localhost:3000`. It will use the URL from `VITE_API_BASE` in `.env`.

### 4. Production build

```bash
npm run build
```

Output is in `frontend/dist/`. Serve it with any static host. Ensure the same backend URL is set via `VITE_API_BASE` when you built (or use a same-origin proxy so `/api/v1` points to your backend).

---

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/v1/auth/register` | Register (username, email, password) |
| POST   | `/api/v1/auth/login`    | Login (username, password) → returns JWT |
| GET    | `/api/v1/tasks`         | List tasks (query: `user`, `status`) – use Bearer token |
| POST   | `/api/v1/tasks/add`     | Create task – use Bearer token |
| PUT    | `/api/v1/tasks/update`  | Update task – use Bearer token |
| DELETE | `/api/v1/tasks/delete`  | Delete task (body: `{ id }`) – use Bearer token |

---

## Quick run (both)

1. Start backend: `cd backend && npm start` (backend on port 5000).
2. Start frontend: `cd frontend && npm run dev` (frontend on port 3000).
3. Open `http://localhost:3000` – register or login, then use the dashboard for tasks.

---

## License

ISC
