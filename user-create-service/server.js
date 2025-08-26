import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import axios from "axios";

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

app.get("/health", (req, res) => res.json({ ok: true, service: "user-create-service" }));

// ✅ Create user
app.post("/users", async (req, res) => {
  const { name, email, mobile, jobRole } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: "name and email are required" });

  try {
    const insert = await pool.query(
      "INSERT INTO users(name, email, mobile, job_role) VALUES($1, $2, $3, $4) RETURNING *",
      [name, email, mobile || null, jobRole || null]
    );
    const user = insert.rows[0];

    // ✅ Send notification (non-blocking)
    const notifyUrl = process.env.NOTIFY_URL;
    if (notifyUrl) {
      try {
        await axios.post(
          notifyUrl,
          {
            email: user.email,
            subject: "Welcome to the platform",
            message: `Hi ${user.name}, your account has been created successfully.`
          },
          { timeout: 5000 }
        );
      } catch (e) {
        console.error("Notification failed:", e.message);
      }
    }

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal error" });
  }
});

// ✅ List users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

const port = 3000;
app.listen(port, () => console.log(`user-create-service listening on ${port}`));
