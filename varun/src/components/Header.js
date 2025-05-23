import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


function Header() {

    const [menuOpen, setMenuOpen] = useState(false); // menuOpen is not used by default
    
    const closeMenu = (event) => {
        if (!event.target.closest(".nav") && !event.target.closest(".menu-icon")) {
          setMenuOpen(false);
        }
    };
    
    useEffect(() => {
        if (menuOpen) {
          document.addEventListener("click", closeMenu);
        } else {
          document.removeEventListener("click", closeMenu);
        }
        return () => document.removeEventListener("click", closeMenu);
    }, [menuOpen]);

    return (
        <header className="header">
            {/* Logo */}
            <div className="logo">
                <Link to="/">
                    <img src="/VeritasAlphaLogoWhite.svg" alt="Logo" className="logo-img" />
                </Link>
            </div>

            {/* Hamburger Menu Icon (Only shows on small screens) */}
            <button className="menu-icon" href='#' onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </button>
            {/* Navigation Links */}
            <nav className={`nav ${menuOpen ? "open" : ""}`}>
                <Link to="/stock">TESTPAGE</Link>
                <Link to="/watchlist">Watchlist</Link>
                <Link to="/learn">Learn</Link>
                <Link to="/about">About</Link>
                <Link to="/faq">FAQs</Link>
                <Link to="/login">Login/Sign-up</Link>
            </nav>
        </header>
    );
}

export default Header;