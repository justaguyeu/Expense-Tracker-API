# 💸 Expense Tracker API

A REST API for tracking expenses built with **Node.js**, **Express.js**, and **MySQL**, fully containerized with **Docker Compose**.

---

## 📋 Requirements

Make sure you have these installed before starting:

- [Node.js 18+](https://nodejs.org)
- [MySQL 8.0](https://dev.mysql.com/downloads/installer/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com)

---

## 🗂️ Project Structure

```
expense-tracker-api/
├── src/
│   ├── index.js              ← Express app entry point
│   ├── db.js                 ← MySQL connection + table init
│   └── routes/
│       └── expenses.js       ← All route handlers
├── Dockerfile                ← Node.js Docker image
├── docker-compose.yml        ← API + MySQL containers
├── package.json
├── .env                      ← Your local config (not pushed to GitHub)
├── .env.example              ← Example config
└── README.md
```

---

## 📡 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/health` | Check API is alive |
| POST | `/api/expenses` | Add a new expense |
| GET | `/api/expenses` | List all expenses |
| GET | `/api/expenses?category=food` | Filter by category |
| GET | `/api/expenses/:id` | Get one expense by ID |
| DELETE | `/api/expenses/:id` | Delete an expense |

---

## 🖥️ Option 1: Run with MySQL Locally

Use this when you want to run the API directly on your machine without Docker.

### Step 1 — Create the database

Open Command Prompt as Administrator and log into MySQL:

```bash
mysql -u root -p
```

Run these commands inside the MySQL shell:

```sql
CREATE DATABASE expensedb;
CREATE USER 'expenseuser'@'localhost' IDENTIFIED BY 'expensepass';
GRANT ALL PRIVILEGES ON expensedb.* TO 'expenseuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 2 — Configure .env

Open the `.env` file and make sure it looks like this:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=expenseuser
DB_PASSWORD=expensepass
DB_NAME=expensedb
PORT=3000
```

### Step 3 — Install dependencies

```bash
cd expense-tracker-api
npm install
```

### Step 4 — Start the API

```bash
npm start
```

You should see:

```
✅ Database table ready
🚀 Expense Tracker API running on http://localhost:3000
```

### Step 5 — Test it

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{ "status": "ok", "timestamp": "2026-01-01T00:00:00.000Z" }
```

---

## 🐳 Option 2: Run with Docker Compose

Use this to run everything (API + MySQL) inside Docker containers.

### Step 1 — Make sure Docker Desktop is open

Check your taskbar for the Docker whale icon. If it is not running, open Docker Desktop and wait for it to start.

### Step 2 — Stop local MySQL (if running)

If MySQL is running locally it will block Docker from using port 3306. Stop it first:

```bash
net stop mysql80
```

If that does not work, find and kill the process using port 3306:

```bash
netstat -ano | findstr :3306
```

Then kill it using the PID number from the result:

```bash
taskkill /PID <PID_NUMBER> /F
```

### Step 3 — Configure .env

Open the `.env` file and set `DB_HOST` to `db`:

```env
DB_HOST=db
DB_PORT=3306
DB_USER=expenseuser
DB_PASSWORD=expensepass
DB_NAME=expensedb
PORT=3000
```

> `db` is the MySQL container name inside the Docker network.

### Step 4 — Build and start containers

```bash
cd expense-tracker-api
docker compose up --build
```

Wait about 20–30 seconds for MySQL to initialize. When ready you will see:

```
expense_api | ✅ Database table ready
expense_api | 🚀 Expense Tracker API running on http://localhost:3000
```

### Step 5 — Test it

Open your browser or Bruno and hit:

```
GET http://localhost:3000/health
```

Expected response:

```json
{ "status": "ok", "timestamp": "2026-01-01T00:00:00.000Z" }
```

---

## 🧪 Testing All Endpoints

Once the API is running (either locally or with Docker), test each endpoint:

### Health Check
```
GET http://localhost:3000/health
```

### Add an expense
```
POST http://localhost:3000/api/expenses
```
Body (JSON):
```json
{
  "amount": 25.50,
  "category": "food",
  "description": "Lunch at the cafe"
}
```

### List all expenses
```
GET http://localhost:3000/api/expenses
```

### Filter by category
```
GET http://localhost:3000/api/expenses?category=food
```

### Get one expense
```
GET http://localhost:3000/api/expenses/1
```

### Delete an expense
```
DELETE http://localhost:3000/api/expenses/1
```

---

## 🐳 Useful Docker Commands

```bash
# Start in background
docker compose up -d --build

# View live API logs
docker compose logs -f api

# Stop all containers
docker compose down

# Stop and wipe the database (fresh start)
docker compose down -v

# Rebuild after code changes
docker compose up --build
```

---

## ⚠️ Common Errors

**Port 3306 already in use**
Your local MySQL is blocking Docker. Run:
```bash
net stop mysql80
```
Then try `docker compose up --build` again.

**API keeps retrying DB connection**
MySQL container is still initializing. Wait 20–30 seconds — it will connect automatically.

**Cannot connect to database locally**
Make sure `DB_HOST=localhost` in your `.env` when running without Docker.

**node_modules not found**
Run `npm install` before `npm start`.
