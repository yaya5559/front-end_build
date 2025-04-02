import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar(){
    const [isOpen, setIsOpen] = useState(false);

    return(
        <nav className="menu">
            <div className="leftmenu">
                <Link to="/">KeyStone Plastic Solution</Link>
            </div>
            <div className="menu-icon" onClick={()=>setIsOpen(!isOpen)}>
                ☰
            </div>
            <ul className={`rightmenu ${isOpen ? "open" : ""}`}>
                <li>Learn</li>
                <li>about us</li>
                <li>Team</li>
            </ul>
        </nav>
    );
};

export default Navbar;