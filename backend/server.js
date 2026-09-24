import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();


app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 200, // all IP se max 200 requests / 15 min
  message: { message: "Bahut zyada requests bhej di, thodi der baad try karo." },
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Bahut zyada login/signup attempts. Thodi der baad try karo." },
});

app.use(express.json());

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);
app.use("/api/auth/google", authLimiter);

/* ------------------------------ ROUTES ------------------------------ */
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "MERN Auth API is running ✅" });
});

/* ------------------------------ MONGODB ------------------------------ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chal raha hai: http://localhost:${PORT}`));
