import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

const signToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET belum di-set di .env");

  return jwt.sign(
    { id: user.id, email: user.email },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export const register = async (req, res) => {
  try {
    const first_name = String(req.body.first_name || "").trim();
    const last_name = String(req.body.last_name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!first_name || !email || !password) {
      return res.status(400).json({ message: "Nama depan, email, dan password wajib diisi" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    const [exists] = await db.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
    if (exists.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, login_type)
       VALUES (?, ?, ?, ?, 'email')`,
      [first_name, last_name || null, email, passwordHash]
    );

    const user = {
      id: result.insertId,
      first_name,
      last_name,
      email,
    };

    const token = signToken(user);

    return res.status(201).json({
      message: "Register berhasil",
      token,
      user,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Register gagal" });
  }
};

export const login = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    const [rows] = await db.query(
      `SELECT id, first_name, last_name, email, password_hash
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Email tidak ditemukan" });
    }

    const userRow = rows[0];

    if (!userRow.password_hash) {
      return res.status(401).json({ message: "Akun ini tidak bisa login dengan password" });
    }

    const match = await bcrypt.compare(password, userRow.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Password salah" });
    }

    const user = {
      id: userRow.id,
      first_name: userRow.first_name || "",
      last_name: userRow.last_name || "",
      email: userRow.email,
    };

    const token = signToken(user);

    return res.json({
      message: "Login berhasil",
      token,
      user,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Login gagal" });
  }
};
