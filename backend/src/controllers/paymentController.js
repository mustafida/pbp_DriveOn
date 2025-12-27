import { db } from "../config/db.js";
import { TripayService } from "../services/tripayService.js";
import { calcOrderAmount } from "../utils/paymentCalc.js";

/**
 * GET /api/payments/tripay/channels
 */
export const getTripayChannels = async (req, res) => {
  try {
    const channels = await TripayService.getPaymentChannels();
    return res.json(channels);
  } catch (err) {
    console.error("getTripayChannels ERROR:", err?.message || err);
    return res.status(500).json({
      message: "Gagal ambil channel pembayaran",
      error: err?.message || String(err),
    });
  }
};

/**
 * POST /api/payments/tripay
 * body: { orderId, method }
 * return: { checkoutUrl, reference, merchantRef, amount }
 */
export const createTripayTransaction = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { orderId, method } = req.body;

    if (!userId) return res.status(401).json({ message: "Token tidak valid" });
    if (!orderId || !method) {
      return res.status(400).json({ message: "orderId dan method wajib diisi" });
    }

    // ambil order + mobil (validasi order milik user)
    const [rows] = await db.query(
      `SELECT o.*, c.name AS car_name, c.price_per_day, c.image_path
       FROM orders o
       JOIN cars c ON c.id = o.car_id
       WHERE o.id = ? AND o.user_id = ?
       LIMIT 1`,
      [orderId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    const order = rows[0];

    // kalau order sudah paid/rented, jangan buat transaksi lagi
    if (order.payment_status === "paid" || order.status === "rented") {
      return res.status(400).json({ message: "Order sudah dibayar / aktif" });
    }

    // hitung total dari tanggal order
    const amount = calcOrderAmount(order.start_date, order.end_date, order.price_per_day);

    // merchant_ref unik untuk Tripay
    const merchantRef = `DO-${order.id}-${Date.now()}`;

    // expired 2 jam dari sekarang
    const expiredSeconds = 2 * 60 * 60;
    const callbackUrl = process.env.TRIPAY_CALLBACK_URL || "";
    const returnUrl = process.env.TRIPAY_RETURN_URL || "";

    if (!callbackUrl || !/^https?:\/\//i.test(callbackUrl)) {
      return res.status(400).json({ message: "TRIPAY_CALLBACK_URL belum valid (harus http/https)" });
    }

    // data customer minimal
    const [userRows] = await db.query(
      `SELECT first_name, last_name, email FROM users WHERE id = ? LIMIT 1`,
      [userId]
    );

    const user = userRows[0] || { first_name: "", last_name: "", email: "" };
    const customerName =
      `${user.first_name || ""} ${user.last_name || ""}`.trim() || "DriveOn User";
    const customerEmail = user.email || "user@driveon.local";

    // item untuk Tripay
    const orderItems = [
      {
        sku: String(order.car_id),
        name: String(order.car_name || "Car Rental"),
        price: Number(amount),
        quantity: 1,
      },
    ];

    // create ke Tripay
    const trx = await TripayService.createTransaction({
      method: String(method).trim(), // jangan dipaksa uppercase, Tripay pakai kode seperti QRIS2, OVO, dll
      merchantRef,
      amount,
      customerName,
      customerEmail,
      orderItems,
      callbackUrl,
      returnUrl,
      expiredSeconds,
    });

    // simpan ke DB
    await db.query(
      `UPDATE orders
       SET payment_reference = ?,
           payment_checkout_url = ?,
           payment_method = ?,
           payment_status = 'pending'
       WHERE id = ? AND user_id = ?`,
      [trx.reference, trx.checkout_url, method, order.id, userId]
    );

    return res.json({
      message: "Transaksi Tripay dibuat",
      checkoutUrl: trx.checkout_url,
      reference: trx.reference,
      merchantRef,
      amount,
    });
  } catch (err) {
    console.error("createTripayTransaction ERROR:", err?.message || err);
    return res.status(500).json({
      message: "Gagal membuat transaksi Tripay",
      error: err?.message || String(err),
    });
  }
};

/**
 * POST /api/payments/tripay/callback
 * - Tripay prod biasanya kirim: { success, data: { reference, status, ... } }
 * - Tripay simulator sering kirim: { reference, status, merchant_ref, ... } (tanpa data)
 *
 * PENTING:
 * - Untuk Tripay: server harus balas 200 agar IPN dianggap sukses
 */
export const tripayCallback = async (req, res) => {
  const rawBody = req.rawBody || "";
  const callbackSignature = req.header("X-Callback-Signature") || "";
  const callbackEvent = req.header("X-Callback-Event") || "";

  try {
    // (1) verifikasi signature kalau ada (biar sandbox test gak mentok)
    if (callbackSignature) {
      const isValid = TripayService.verifyCallbackSignature({
        rawBody,
        callbackSignature,
      });
      if (!isValid) {
        console.warn("tripayCallback: signature invalid");
        // tetap 200 biar Tripay tidak retry terus (sandbox)
        return res.status(200).json({ success: false, message: "Invalid callback signature" });
      }
    }

    // (2) ambil payload: support 2 format (data / root)
    const payload = req.body?.data ? req.body.data : req.body;

    const reference = String(payload?.reference || "");
    const statusRaw = String(payload?.status || "").toUpperCase();

    if (!reference) {
      console.warn("tripayCallback: reference kosong", req.body);
      // tetap 200 (Tripay butuh 200)
      return res.status(200).json({ success: false, message: "Reference kosong" });
    }

    // (3) mapping status Tripay -> status kita
    let paymentStatus = "pending";
    if (statusRaw === "PAID") paymentStatus = "paid";
    else if (statusRaw === "EXPIRED") paymentStatus = "expired";
    else if (statusRaw === "FAILED") paymentStatus = "failed";
    else if (statusRaw === "UNPAID") paymentStatus = "unpaid";
    else paymentStatus = "pending";

    const paidAt = paymentStatus === "paid" ? new Date() : null;

    // (4) update order by payment_reference
    const [result] = await db.query(
      `UPDATE orders
       SET payment_status = ?,
           paid_at = ?,
           status = CASE WHEN ? = 'paid' THEN 'rented' ELSE status END
       WHERE payment_reference = ?
       LIMIT 1`,
      [paymentStatus, paidAt, paymentStatus, reference]
    );

    // (5) balas 200 selalu
    return res.status(200).json({
      success: true,
      message: "Callback diterima",
      event: callbackEvent,
      reference,
      paymentStatus,
      affectedRows: result?.affectedRows || 0,
    });
  } catch (err) {
    console.error("tripayCallback ERROR:", err?.message || err);

    // PENTING: tetap 200 agar Tripay tidak menganggap IPN gagal
    return res.status(200).json({
      success: false,
      message: "Callback diproses tapi terjadi error internal",
      event: callbackEvent,
      error: err?.message || String(err),
    });
  }
};
