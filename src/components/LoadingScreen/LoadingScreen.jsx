import React from "react";
import "./LoadingScreen.scss";
import loading from "../../assets/loading.gif";
function LoadingScreen() {
  return (
    <div className="loading">
      <h1>Checking What's Around</h1>
      <img className="loading__gif" src={loading}/>
    </div>
  );
}

export default LoadingScreen;
