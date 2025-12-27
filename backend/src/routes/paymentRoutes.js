import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createTripayTransaction,
  tripayCallback,
  getTripayChannels,
} from "../controllers/paymentController.js";

const router = express.Router();

/**
 * (Optional) list channel pembayaran Tripay (BCA/BNI/BRIVA/QRIS dll)
 * butuh auth biar nggak kebuka bebas (boleh kamu hapus kalau gak perlu)
 */
router.get("/tripay/channels", authMiddleware, getTripayChannels);

/**
 * Buat transaksi Tripay (redirect)
 * Flutter panggil ini -> dapat checkout_url
 */
router.post("/tripay", authMiddleware, createTripayTransaction);

/**
 * Callback Tripay (HARUS PUBLIC, JANGAN pakai auth)
 * Tripay akan hit endpoint ini
 */
router.post("/tripay/callback", tripayCallback);

export default router;
