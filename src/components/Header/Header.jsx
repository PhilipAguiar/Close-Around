import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import logo from "../../assets/close-around-v2.png";

function Header({ clickHandler }) {
  return (
    <div className="header">
      <Link to="/">
        <img className="header__logo" src={logo} alt="logo" />
      </Link>

      <Link className="header__button" to="/login">
        Login
      </Link>
    </div>
  );
}

export default Header;
