# MERN Login/Signup App (Google Sign-In + First-Time Profile Popup)

Ye ek pura MERN stack project hai jisme:

- ✅ Email/Password se **Signup & Login**
- ✅ **Google ke through Signup/Login** (Firebase Authentication use karke)
- ✅ Pehli baar login/signup karne par **popup** khulta hai jo Name, Mobile Number, Age poochta hai
- ✅ Popup band hone ke baad **Welcome Page** khulta hai jisme "Welcome" text + profile icon dikhta hai
- ✅ Security ke liye **firewall-jaisi layer**: Helmet (secure headers), Rate-Limiting (brute-force/DDoS se bachav), CORS
- ✅ JWT token based session

---

## 📁 Folder Structure

```
mern-auth-app/
├── backend/          → Node.js + Express + MongoDB API
│   ├── config/
│   │   └── firebaseAdmin.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── .env.example
└── frontend/         → React (Vite) app
    ├── src/
    │   ├── pages/ (Login.jsx, Signup.jsx, Welcome.jsx)
    │   ├── components/ (ProfilePopup.jsx)
    │   ├── firebase.js
    │   ├── api.js
    │   └── App.jsx
    └── .env.example
```

---

## 🔧 Step 1: MongoDB Setup

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) par free account banao (ya local MongoDB install karo).
2. Ek cluster banao, database user banao, connection string copy karo.
3. Ye string `backend/.env` file me `MONGO_URI` me daalni hai.

---

## 🔥 Step 2: Firebase Setup (Google Login ke liye)

1. [Firebase Console](https://console.firebase.google.com/) par jao aur naya project banao.
2. **Authentication → Sign-in method → Google** ko enable karo.
3. **Project Settings → General → Your apps → Add app (Web)**. Yahan se milne wali config
   `frontend/.env` file me daalni hai (`.env.example` dekho).
4. **Project Settings → Service Accounts → Generate new private key**. Jo JSON file download
   hogi use `backend/config/serviceAccountKey.json` naam se save karo.
   (Ye file kabhi GitHub par push mat karna, ye secret hoti hai.)

---

## ⚙️ Step 3: Backend Chalao

```bash
cd backend
npm install
cp .env.example .env
# ab .env file me apni MONGO_URI, JWT_SECRET, CLIENT_URL bharo
npm run dev
```

Backend `http://localhost:5000` par chalega.

---

## 🎨 Step 4: Frontend Chalao

```bash
cd frontend
npm install
cp .env.example .env
# ab .env file me apni Firebase keys aur VITE_API_URL bharo
npm run dev
```

Frontend `http://localhost:5173` par khulega.

---

## 🚀 Kaise Kaam Karta Hai

1. User `/signup` page par email/password se signup karta hai **ya** "Continue with Google" dabata hai.
2. Backend naya user MongoDB me bana deta hai, JWT token bhejta hai — `isProfileComplete: false` set rehta hai.
3. Login hote hi frontend check karta hai `isProfileComplete`. Agar `false` hai to **popup** khul jata hai
   jisme Name, Mobile, Age poocha jata hai.
4. Popup submit hote hi `PUT /api/auth/complete-profile` call hoti hai jo `isProfileComplete: true` kar deti hai.
5. Popup band ho jata hai aur **Welcome Page** dikhta hai — "Welcome, {Name}" + profile icon (agar Google
   photo hai to wo dikhegi, warna naam ka pehla letter circle icon me dikhega).
6. Agli baar login karne par, `isProfileComplete` already `true` hai, isliye popup nahi khulega — seedha
   Welcome page milega.

---

## 🛡️ Security / "Firewall" Layer

Backend me ye security measures already lage hue hain (`server.js` me):

- **Helmet** → HTTP response headers secure karta hai (XSS, clickjacking, MIME-sniffing attacks se bachav)
- **express-rate-limit** → Ek IP se bahut zyada requests block karta hai (DDoS/brute-force attempts rokta hai).
  Login/Signup/Google routes par extra strict limit (15 min me max 20 attempts) lagi hai.
- **CORS** → Sirf tumhari frontend URL (`CLIENT_URL`) se aane wali requests allow hoti hain
- **JWT** → Har protected request token verify karke hi chalti hai
- **bcryptjs** → Password kabhi plain text me store nahi hota, hamesha hashed hota hai

> Agar tumhara matlab network-level "firewall" (jaise AWS Security Group / Nginx / Cloudflare) se tha,
> to ye application ko kisi bhi cloud server (AWS EC2, DigitalOcean, Render, etc.) par deploy karne ke
> baad us server ke firewall rules me sirf port 80/443 aur apni backend port open karo — baaki sab band
> rakho. Production me hamesha HTTPS (Cloudflare ya Let's Encrypt) use karo.

---

## 📦 Deployment Tips

- **Backend**: Render / Railway / AWS EC2 par deploy karo. `.env` variables wahan ke dashboard me set karo.
- **Frontend**: Vercel / Netlify par deploy karo (`npm run build` se banega `dist` folder).
- Deploy karne ke baad, `CLIENT_URL` (backend) aur `VITE_API_URL` (frontend) ko production URLs se update karna
  mat bhoolna, aur Firebase Console me **Authorized Domains** me apna production domain add karo.

---

Koi bhi step me dikkat aaye to bata dena! 🙂
