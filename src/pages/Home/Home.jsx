import React from "react";
import { Link } from "react-router-dom";
import "./Home.scss";

function Home() {
  return (
    <div className="home">
      <div className="home__background"></div>
      <div className="home__container">
      <h1 className="home__header">Welcome!</h1>
      <h3>Check whats close around!</h3>
      <Link to="/map">Here</Link>
      </div>
    </div>
  );
}

export default Home;
