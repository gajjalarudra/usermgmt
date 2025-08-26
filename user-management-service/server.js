import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "RudraVHS@1430",
  database: process.env.DB_NAME || "usermgmt",
  port: Number(process.env.DB_PORT || 5432)
});

app.get("/health", (req, res) => res.json({ ok: true, service: "user-management-service" }));

// ✅ List all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

// ✅ Get single user
app.get("/users/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id=$1", [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

// ✅ Update user (now includes mobile + job_role)
app.put("/users/:id", async (req, res) => {
  const { name, email, mobile, jobRole } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: "name and email are required" });

  try {
    const result = await pool.query(
      "UPDATE users SET name=$1, email=$2, mobile=$3, job_role=$4 WHERE id=$5 RETURNING *",
      [name, email, mobile || null, jobRole || null, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal error" });
  }
});

// ✅ Delete user
app.delete("/users/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

const port = 3001;
app.listen(port, () => console.log(`user-management-service listening on ${port}`));
