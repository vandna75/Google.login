import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Welcome from "./pages/Welcome.jsx";
import ProfilePopup from "./components/ProfilePopup.jsx";
import api from "./api.js";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Page load / refresh hone par, agar token save hai to user ko wapas login state me le aao
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const handleAuthSuccess = ({ token, user }) => {
    localStorage.setItem("token", token);
    setUser(user);
  };

  const handleProfileComplete = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return <div className="page-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" /> : <Login onAuthSuccess={handleAuthSuccess} />
          }
        />
        <Route
          path="/signup"
          element={
            user ? <Navigate to="/" /> : <Signup onAuthSuccess={handleAuthSuccess} />
          }
        />
        <Route
          path="/"
          element={
            user ? (
              <>
                <Welcome user={user} onLogout={handleLogout} />
                {/* First-time login par profile complete karne ka popup */}
                {!user.isProfileComplete && (
                  <ProfilePopup user={user} onComplete={handleProfileComplete} />
                )}
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
