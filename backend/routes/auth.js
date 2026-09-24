import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import admin from "../config/firebaseAdmin.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// JWT token generate karne ka helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Response me kaam ki user info bhejne ka helper
const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  mobile: user.mobile,
  age: user.age,
  photoURL: user.photoURL,
  isProfileComplete: user.isProfileComplete,
});

/* ------------------------------------------------------------------ */
/* 1) NORMAL SIGNUP (email + password)                                */
/* ------------------------------------------------------------------ */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required " });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      authProvider: "local",
      isProfileComplete: false, // first login pe popup dikhega
    });

    const token = generateToken(user._id);
    res.status(201).json({ token, user: buildUserResponse(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ------------------------------------------------------------------ */
/* 2) NORMAL LOGIN (email + password)                                 */
/* ------------------------------------------------------------------ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ message: "Email and password are wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email and password are wrong" });
    }

    const token = generateToken(user._id);
    res.json({ token, user: buildUserResponse(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ------------------------------------------------------------------ */
/* 3) GOOGLE LOGIN / SIGNUP (Firebase ID token verify karke)           */
/* ------------------------------------------------------------------ */
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "idToken required hai" });
    }

    // Firebase se aaya hua token verify karo
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;

    let user = await User.findOne({ $or: [{ googleUid: uid }, { email }] });

    let isNewUser = false;

    if (!user) {
      // Naya user -> account bana do, profile abhi incomplete hai
      user = await User.create({
        name,
        email,
        googleUid: uid,
        authProvider: "google",
        photoURL: picture,
        isProfileComplete: false,
      });
      isNewUser = true;
    } else if (!user.googleUid) {
      // Agar email se pehle se local account tha, use google se bhi link kar do
      user.googleUid = uid;
      user.photoURL = user.photoURL || picture;
      await user.save();
    }

    const token = generateToken(user._id);
    res.json({ token, user: buildUserResponse(user), isNewUser });
  } catch (err) {
    res.status(401).json({ message: "Google authentication failed", error: err.message });
  }
});

/* ------------------------------------------------------------------ */
/* 4) COMPLETE PROFILE (name, mobile, age) - first login popup submit  */
/* ------------------------------------------------------------------ */
router.put("/complete-profile", protect, async (req, res) => {
  try {
    const { name, mobile, age } = req.body;

    if (!name || !mobile || !age) {
      return res.status(400).json({ message: "Name, mobile and age are required" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User does not match" });

    user.name = name;
    user.mobile = mobile;
    user.age = age;
    user.isProfileComplete = true;

    await user.save();

    res.json({ user: buildUserResponse(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ------------------------------------------------------------------ */
/* 5) GET CURRENT LOGGED-IN USER (page refresh par session restore)    */
/* ------------------------------------------------------------------ */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User does not match" });
    res.json({ user: buildUserResponse(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
