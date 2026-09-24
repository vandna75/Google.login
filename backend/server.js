import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// 1. Helmet configuration (Cross-Origin Policy Fix for Google Auth)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
  })
);

// 2. Allowed origins list
const allowedOrigins = [
  "https://loginsingup-pages.netlify.app",
  "http://localhost:5173",
  process.env.CLIENT_URL
].filter(Boolean);

// 3. CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
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