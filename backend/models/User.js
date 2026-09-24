import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String, // sirf normal signup ke liye, Google users ke liye ye khali rahega
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleUid: {
      type: String, // Firebase UID, sirf Google login users ke liye
    },
    mobile: {
      type: String,
    },
    age: {
      type: Number,
    },
    photoURL: {
      type: String,
    },
    // Ye flag decide karta hai ki extra-info popup dikhana hai ya nahi
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
