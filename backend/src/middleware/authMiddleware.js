import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const parts = auth.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Token tidak valid" });
    }

    const token = parts[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT_SECRET belum di-set di .env" });
    }

    const payload = jwt.verify(token, secret);

    req.user = {
      id: payload.id,
      email: payload.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};
