import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCfhY-Ixt1hYXkJuWT1CvpPgKEWBU6AmB0",
  authDomain: "mern-auth-app-cd4e3.firebaseapp.com",
  projectId: "mern-auth-app-cd4e3",
  storageBucket: "mern-auth-app-cd4e3.firebasestorage.app",
  messagingSenderId: "540313261429",
  appId: "1:540313261429:web:c531d98326aca7088aef3c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;