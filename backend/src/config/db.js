import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// kalau DB_PASS kosong, jangan kirim password (biar tidak "using password: YES")
const rawPass = process.env.DB_PASS;
const password = rawPass && rawPass.trim() !== "" ? rawPass : undefined;

if (!process.env.DB_NAME) {
  console.warn("⚠️ DB_NAME kosong. Isi DB_NAME di .env (contoh: driveon)");
}

export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
