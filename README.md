# Primetrade.ai – Task API (Backend)

REST API with JWT auth and role-ready structure. CRUD APIs for tasks.

---

## Project structure

- **`backend/`** – Express + MongoDB, auth & tasks APIs

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

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/v1/auth/register` | Register (name, email, password) |
| POST   | `/api/v1/auth/login`    | Login (email, password) → returns JWT |
| GET    | `/api/v1/tasks`         | List tasks (query: `user`, `status`) – use Bearer token |
| POST   | `/api/v1/tasks/add`     | Create task – use Bearer token |
| PUT    | `/api/v1/tasks/update`  | Update task – use Bearer token |
| DELETE | `/api/v1/tasks/delete`  | Delete task (body: `{ id }`) – use Bearer token |

---

## License

ISC
