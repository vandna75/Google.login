import { useState } from "react";
import api from "../api.js";

// Ye popup sirf tab dikhta hai jab user.isProfileComplete === false ho
// (yaani pehli baar login/signup karne ke baad)
function ProfilePopup({ user, onComplete }) {
  const [name, setName] = useState(user.name || "");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[0-9]{10}$/.test(mobile)) {
      setError("Mobile number 10 digit ka hona chahiye");
      return;
    }
    if (age < 1 || age > 120) {
      setError("Sahi age daalo");
      return;
    }

    setLoading(true);
    try {
      const res = await api.put("/auth/complete-profile", {
        name,
        mobile,
        age: Number(age),
      });
      onComplete(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Kuch galat ho gaya");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h2>Fill your details </h2>
        <p className="subtitle">Your informations fill only one time</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Apna naam likho"
            required
          />

          <label>Mobile Number</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="10 digit mobile number"
            maxLength={10}
            required
          />

          <label>Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Apni age likho"
            required
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePopup;
