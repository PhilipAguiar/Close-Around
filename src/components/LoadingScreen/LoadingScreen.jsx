import React from "react";
import "./LoadingScreen.scss";
import loading from "../../assets/loading.gif";
function LoadingScreen() {
  return (
    <div className="loading">
      <div className="loading__wrapper">
        <h1>Checking What's Around</h1>
        <img className="loading__gif" src={loading} alt="spinning globe" />
      </div>
    </div>
  );
}

export default LoadingScreen;
