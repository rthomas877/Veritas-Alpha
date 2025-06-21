import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';



function HeaderSignedIn() {

    const [menuOpen, setMenuOpen] = useState(false); // menuOpen is not used by default
    const [userName, setUserName] = useState("");
    const [userFirstName, setUserFirstName] = useState('');
    const [userEmail, setUserEmail] = useState(null);


    
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
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserEmail(decoded.sub || decoded.email); // sub = subject = email in your JWT
                setUserName(decoded.name);
                setUserFirstName(decoded.name.split(' ')[0]);
                console.log('Decoded token:', decoded);
            } catch (err) {
                console.error('Invalid token', err);
                localStorage.removeItem('token'); // optional: cleanup
            }
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
                {/* <Link to="/stock">TESTPAGE</Link> */}
                <Link to="/watchlist">Watchlist</Link>
                <Link to="/learn">Learn</Link>
                <Link to="/about">About</Link>
                <Link to="/faq">FAQs</Link>
                <Link to="/account">{userFirstName}</Link>
            </nav>
        </header>
    );
}

export default HeaderSignedIn;