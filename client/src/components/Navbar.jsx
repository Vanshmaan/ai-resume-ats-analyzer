import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [active, setActive] = useState("/");
  const [scrolled, setScrolled] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const sky = "#38bdf8"; // sky blue
  const text = "#cbd5e1";

  const handleClick = (path) => setActive(path);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={scrolled ? "scrolled" : ""}>
      {/* LEFT */}
      <div className="nav-left">
        <Link to="/" onClick={() => handleClick("/")} className="logo">
          <span className="logo-icon">🎯</span>
          <span>ATS Analyzer</span>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            onClick={() => handleClick("/")}
            className={active === "/" ? "active" : ""}
          >
            Home
          </Link>

          <Link
            to="/contact"
            onClick={() => handleClick("/contact")}
            className={active === "/contact" ? "active" : ""}
          >
            Contact
          </Link>
          
          {token && (
            <Link
              to="/upload"
              onClick={() => handleClick("/upload")}
              className={active === "/upload" ? "active" : ""}
            >
              Upload
            </Link>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        {!token ? (
          <>
            <Link
              to="/login"
              onClick={() => handleClick("/login")}
              className={active === "/login" ? "active" : ""}
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => handleClick("/register")}
              className="nav-button"
            >
              Register
            </Link>
          </>
        ) : (
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;