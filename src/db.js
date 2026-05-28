const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "expenseuser",
  password: process.env.DB_PASSWORD || "expensepass",
  database: process.env.DB_NAME || "expensedb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initDB() {
  const conn = await pool.getConnection();
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS expenses (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      amount     DECIMAL(10, 2) NOT NULL,
      category   VARCHAR(100)   NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  conn.release();
  console.log("✅ Database table ready");
}

module.exports = { pool, initDB };
