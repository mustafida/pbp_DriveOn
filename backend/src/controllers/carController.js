import { db } from "../config/db.js";

export const getCars = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cars ORDER BY id ASC");
    return res.json(rows);
  } catch (error) {
    console.error("GET CARS ERROR:", error);
    return res.status(500).json({ message: "Gagal ambil data mobil" });
  }
};

export const getCarById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "ID mobil tidak valid" });

    const [rows] = await db.query("SELECT * FROM cars WHERE id = ? LIMIT 1", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Car not found" });

    return res.json(rows[0]);
  } catch (error) {
    console.error("GET CAR BY ID ERROR:", error);
    return res.status(500).json({ message: "Gagal ambil detail mobil" });
  }
};
