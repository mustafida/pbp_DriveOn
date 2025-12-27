import { db } from "../config/db.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Token tidak valid" });
    }

    const [rows] = await db.query(
      `SELECT id, first_name, last_name, email, login_type, created_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    return res.status(500).json({ message: "Gagal mengambil profil" });
  }
};
