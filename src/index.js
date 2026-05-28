require("dotenv").config();
const express = require("express");
const { initDB } = require("./db");
const expensesRouter = require("./routes/expenses");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/expenses", expensesRouter);

app.get("/api", (req, res) => {
  res.json({
    name: "Expense Tracker API",
    version: "1.0.0",
    endpoints: [
      { method: "GET", url: "/health", description: "Health check" },
      {
        method: "POST",
        url: "/api/expenses",
        description: "Add a new expense",
      },
      { method: "GET", url: "/api/expenses", description: "List all expenses" },
      {
        method: "GET",
        url: "/api/expenses?category=:name",
        description: "Filter expenses by category",
      },
      {
        method: "GET",
        url: "/api/expenses/:id",
        description: "Get one expense by ID",
      },
      {
        method: "DELETE",
        url: "/api/expenses/:id",
        description: "Delete an expense",
      },
    ],
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error." });
});

async function start() {
  let retries = 10;
  while (retries > 0) {
    try {
      await initDB();
      break;
    } catch (err) {
      retries--;
      console.log(`⏳ Waiting for DB... (${retries} retries left)`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  if (retries === 0) {
    console.error("Could not connect to the database. Exiting.");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Expense Tracker API running on http://localhost:${PORT}`);
    console.log(`Endpoints:`);
    console.log(`   POST   /api/expenses`);
    console.log(`   GET    /api/expenses`);
    console.log(`   GET    /api/expenses?category=<name>`);
    console.log(`   GET    /api/expenses/:id`);
    console.log(`   DELETE /api/expenses/:id`);
  });
}

start();
