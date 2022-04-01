import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";

function Header({clickHandler}) {
  return (
    <div className="header">
      <Link to="/">Go Back</Link>
      <button onClick={clickHandler}>Change Location</button>
    </div>
  );
}

export default Header;
