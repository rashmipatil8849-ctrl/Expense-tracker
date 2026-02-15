import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={navStyle}>
      <h2 style={{ margin: 0 }}>Bellcorp Tracker</h2>

      <div>
        <Link style={linkStyle} to="/">Dashboard</Link>
        <Link style={linkStyle} to="/explorer">Explorer</Link>
        <button style={logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 40px",
  background: "#1f2937",
  color: "white"
};

const linkStyle = {
  color: "white",
  marginRight: "20px",
  textDecoration: "none",
  fontWeight: "500"
};

const logoutBtn = {
  padding: "6px 12px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

export default Navbar;
