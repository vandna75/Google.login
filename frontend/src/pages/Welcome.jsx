import { useState } from "react";

function Welcome({ user, onLogout }) {
  const initial = (user.name || user.email || "U").charAt(0).toUpperCase();
  const [imgError, setImgError] = useState(false);

  const showImage = user.photoURL && !imgError;

  return (
    <div className="welcome-page">
      <header className="navbar">
        <div className="brand">MyApp</div>
        <div className="profile-area">
          {showImage ? (
            <img
              src={user.photoURL}
              alt="profile"
              className="profile-icon-img"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="profile-icon">{initial}</div>
          )}
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="welcome-content">
        <div className="welcome-card">
          {showImage ? (
            <img
              src={user.photoURL}
              alt="profile"
              className="profile-icon-big-img"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="profile-icon-big">{initial}</div>
          )}
          <h1>Welcome, {user.name || "User"} 👋</h1>
          <div className="user-details">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            {user.mobile && (
              <p>
                <strong>Mobile:</strong> {user.mobile}
              </p>
            )}
            {user.age && (
              <p>
                <strong>Age:</strong> {user.age}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Welcome;