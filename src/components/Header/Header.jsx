import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";

function Header() {
  return (
    <div className="header">
      <Link to="/">Go Back</Link>
    </div>
  );
}

export default Header;
