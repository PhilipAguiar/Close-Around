import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";

function Header({clickHandler}) {
  return (
    <div className="header">
      <Link to="/">Go Back</Link>
      <Link className="header__button" to= "/login">Login</Link>
    </div>
  );
}

export default Header;
