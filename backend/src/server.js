import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const PORT = Number(process.env.PORT || 5000);
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}`);
});
