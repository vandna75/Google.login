import admin from "firebase-admin";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Firebase Admin SDK ko initialize karte hain (Google Sign-In verify karne ke liye)
// LOCAL computer par: serviceAccountKey.json file se padhega
// DEPLOY (Render) par: FIREBASE_SERVICE_ACCOUNT_JSON environment variable se padhega
if (!admin.apps.length) {
  try {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      // Render/production: env variable me pura JSON text daala hai
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } else {
      // Local computer: file se padho
      const serviceAccountPath =
        process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./config/serviceAccountKey.json";
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized");
  } catch (err) {
    console.warn(
      "⚠️  Firebase Admin init nahi ho paya. Google Sign-In kaam nahi karega jab tak serviceAccountKey set nahi karte.\n",
      err.message
    );
  }
}

export default admin;