import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: "12px 20px", borderBottom: "1px solid #ccc", display: "flex", gap: 16, alignItems: "center" }}>
      <Link to="/">Products</Link>
      <Link to="/favorites">Favorites</Link>
      {token ? (
        <>
          <span>{user?.name}</span>
          <button type="button" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
