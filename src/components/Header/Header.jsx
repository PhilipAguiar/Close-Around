import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import logo from "../../assets/close-around-v2.png";

function Header() {
  return (
    <div className="header">
      
      <Link to="/">
        <img className="header__logo" src={logo} alt="logo" />
      </Link>

      <div>
        <Link className="header__button" to="/map">
          Map
        </Link>

        <Link className="header__button" to="/login">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Header;
