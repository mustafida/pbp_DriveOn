import { db } from "../config/db.js";

const calcDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days <= 0 ? 1 : days;
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { carId, startDate, endDate, pickupLocation, note } = req.body;

    if (!userId) return res.status(401).json({ message: "Token tidak valid" });

    if (!carId || !startDate || !endDate || !pickupLocation) {
      return res.status(400).json({
        message: "carId, startDate, endDate, pickupLocation wajib diisi",
      });
    }

    const [cars] = await db.query("SELECT id FROM cars WHERE id = ? LIMIT 1", [carId]);
    if (cars.length === 0) {
      return res.status(404).json({ message: "Mobil tidak ditemukan" });
    }

    const createdAt = new Date();
    const expiredAt = new Date(createdAt.getTime() + 2 * 60 * 60 * 1000);

    const [result] = await db.query(
      `INSERT INTO orders
       (user_id, car_id, start_date, end_date, pickup_location, note, status, rating, created_at, payment_expired_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        carId,
        startDate,
        endDate,
        pickupLocation,
        note || null,
        "unpaid",
        null,
        createdAt,
        expiredAt,
      ]
    );

    return res.status(201).json({
      message: "Order berhasil dibuat",
      orderId: result.insertId,
    });
  } catch (error) {
    console.error("createOrder ERROR:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Token tidak valid" });

    const [orders] = await db.query(
      `SELECT o.*, c.name AS car_name, c.image_path, c.price_per_day
       FROM orders o
       JOIN cars c ON o.car_id = c.id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );

    return res.json(orders);
  } catch (error) {
    console.error("getMyOrders ERROR:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrderDetail = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ message: "Token tidak valid" });

    const [rows] = await db.query(
      `SELECT o.*, c.id AS car_id, c.name AS car_name, c.price_per_day, c.image_path
       FROM orders o
       JOIN cars c ON o.car_id = c.id
       WHERE o.id = ? AND o.user_id = ?
       LIMIT 1`,
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    const order = rows[0];

    const days = calcDays(order.start_date, order.end_date);
    const subtotal = days * Number(order.price_per_day || 0);
    const tripFee = 1000;
    const total = subtotal + tripFee;

    return res.json({
      id: order.id,
      user_id: order.user_id,
      status: order.status,
      payment_status: order.payment_status,
      rating: order.rating,
      startDate: order.start_date,
      endDate: order.end_date,
      pickupLocation: order.pickup_location,
      note: order.note,
      createdAt: order.created_at,
      paymentExpiredAt: order.payment_expired_at,
      car: {
        id: order.car_id,
        name: order.car_name,
        pricePerDay: order.price_per_day,
        image: order.image_path,
      },
      days,
      subtotal,
      tripFee,
      total,
    });
  } catch (error) {
    console.error("getOrderDetail ERROR:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const reviewOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { rating } = req.body;

    if (!userId) return res.status(401).json({ message: "Token tidak valid" });

    const r = Number(rating);
    if (!r || r < 1 || r > 5) {
      return res.status(400).json({ message: "Rating harus 1 sampai 5" });
    }

    // Biar masuk akal: review hanya kalau order sudah selesai/atau minimal rented
    const [rows] = await db.query(
      `SELECT id, status FROM orders WHERE id = ? AND user_id = ? LIMIT 1`,
      [id, userId]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Order tidak ditemukan" });

    // set finished + rating
    const [result] = await db.query(
      `UPDATE orders
       SET rating = ?, status = 'finished'
       WHERE id = ? AND user_id = ?`,
      [r, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    return res.json({ message: "Rating berhasil disimpan" });
  } catch (error) {
    console.error("reviewOrder ERROR:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
