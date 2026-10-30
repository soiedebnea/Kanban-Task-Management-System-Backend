# Kanban Backend

REST API for the Kanban task manager, built with **Node.js, Express and MongoDB (Mongoose)**.

## File structure

```
kanban-backend/
├── README.md
├── package.json
├── .env.example            # copy to .env
├── .gitignore
├── server.js               # app entry, middleware, MongoDB connection
├── models/
│   └── Task.js             # Task schema (status, priority, deadline, order)
├── routes/
│   └── tasks.js            # CRUD + reorder endpoints
└── middleware/
    └── errorHandler.js     # validation and server error responses
```

## Requirements

- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup

```bash
cd kanban-backend
npm install
cp .env.example .env
npm run dev        # development (auto-restart)
# or
npm start          # production
```

When it works, the terminal shows:

```
MongoDB connected
API running on http://localhost:5000
```

Health check: http://localhost:5000/api/health

## Environment variables (`.env`)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/kanban
CLIENT_ORIGIN=http://localhost:5173
```

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on |
| `MONGO_URI` | MongoDB connection string (local or Atlas) |
| `CLIENT_ORIGIN` | Frontend URL allowed by CORS; must match exactly |

MongoDB Atlas example:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/kanban?retryWrites=true&w=majority
```

## Task document

```json
{
  "_id": "...",
  "title": "Write report",
  "description": "optional",
  "status": "todo | in-progress | done",
  "priority": "low | medium | high",
  "deadline": "2026-10-30T00:00:00.000Z",
  "order": 0,
  "createdAt": "...",
  "updatedAt": "..."
}
```

## API endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/tasks` | List tasks (optional `?status=todo`) |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| PUT | `/api/tasks/reorder` | Save positions after drag & drop: `{ "items": [{ "id", "status", "order" }] }` |
| DELETE | `/api/tasks/:id` | Delete a task |

Example:

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Design homepage","priority":"high","deadline":"2026-10-30"}'
```

## Troubleshooting

| Problem | Fix |
|---|---|
| `MongoDB connection failed` | Start MongoDB or check `MONGO_URI` |
| CORS error in the browser | Set `CLIENT_ORIGIN` to the exact frontend URL |
| `.env` changes ignored | Restart the server |
| Atlas connection refused | Add your IP under Network Access; URL-encode special characters in the password |
