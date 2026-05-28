const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// ➕ POST /api/expenses — Add a new expense
router.post("/", async (req, res) => {
  const { amount, category, description } = req.body;

  if (!amount || !category) {
    return res
      .status(400)
      .json({ error: "Fields 'amount' and 'category' are required." });
  }

  if (isNaN(amount) || Number(amount) <= 0) {
    return res
      .status(400)
      .json({ error: "'amount' must be a positive number." });
  }

  try {
    const [result] = await pool.execute(
      "INSERT INTO expenses (amount, category, description) VALUES (?, ?, ?)",
      [Number(amount), category.trim(), description?.trim() || null]
    );

    const [rows] = await pool.execute(
      "SELECT * FROM expenses WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create expense." });
  }
});

// 📋 GET /api/expenses — List all expenses (optional ?category= filter)
router.get("/", async (req, res) => {
  const { category } = req.query;

  try {
    let rows;
    if (category) {
      [rows] = await pool.execute(
        "SELECT * FROM expenses WHERE category = ? ORDER BY created_at DESC",
        [category.trim()]
      );
    } else {
      [rows] = await pool.execute(
        "SELECT * FROM expenses ORDER BY created_at DESC"
      );
    }

    res.json({
      count: rows.length,
      expenses: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch expenses." });
  }
});

// 🔍 GET /api/expenses/:id — Get a single expense by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM expenses WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: `Expense with id ${id} not found.` });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch expense." });
  }
});

// 🗑️ DELETE /api/expenses/:id — Delete an expense
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM expenses WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: `Expense with id ${id} not found.` });
    }

    await pool.execute("DELETE FROM expenses WHERE id = ?", [id]);

    res.json({ message: `Expense ${id} deleted successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete expense." });
  }
});

module.exports = router;
