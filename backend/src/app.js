import express from "express";
import morgan from "morgan";
import cors from "cors";

import carRoutes from "./routes/carRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

app.use(cors());

// ✅ penting untuk Tripay callback signature
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "DriveOn API aktif" });
});

app.use("/api/cars", carRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route tidak ditemukan" });
});

export default app;
