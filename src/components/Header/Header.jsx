import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import logo from "../../assets/close-around-v2.png"

function Header({clickHandler}) {
  return (
    <div className="header">
      <img className="info-section__logo" src={logo} alt="logo" />
      <Link className="header__button" to= "/login">Login</Link>
    </div>
  );
}

export default Header;
