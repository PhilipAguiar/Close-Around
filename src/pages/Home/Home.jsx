import React from "react";
import "./Home.scss";
import desktop from "../../assets/desktop.png";
import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [whatActive, setWhatActive] = useState(false);
  const [howActive, setHowActive] = useState(false);
  const [joinActive, setJoinActive] = useState(false);
  return (
    <section className="home">
      <div className="home__hero">
        {!whatActive && !howActive && !joinActive && (
          <>
            <div className="home__text-wrapper">
              <h1>Don't have plans? Not sure what to do this weekend?</h1>
              <p>CloseAround helps you find fun close to home!</p>
              <Link to="/map">See whats Close Around!</Link>
            </div>
            <img className="home__image" src={desktop} alt="" />
          </>
        )}
        {whatActive && (
          <>
            <div className="home__text-wrapper">
              <h1>What is Close Around?</h1>
              <p>CloseAround lets you see what events and excitement are happening your neighborhood!</p>
            </div>
            <img className="home__image" src={desktop} alt="" />
          </>
        )}
        {howActive && (
          <>
            <img className="home__image" src={desktop} alt="" />
            <div className="home__text-wrapper">
              <h1>How does Close Around Work?</h1>
              <p>Close Around shows you a map populated by your community!</p>
            </div>
          </>
        )}
        {joinActive && (
          <>
            <div className="home__text-wrapper">
              <h1>You'll never know whats Close Around</h1>
              <p>Sign up now!</p>
            </div>
            <img className="home__image" src={desktop} alt="" />
          </>
        )}
      </div>
      <div className="home__info-section">
        <div
          className="home__card"
          onMouseEnter={() => {
            setWhatActive(true);
          }}
          onMouseLeave={() => {
            setWhatActive(false);
          }}
        >
          <p>What is it?</p>
        </div>
        <div
          className="home__card"
          onMouseEnter={() => {
            setHowActive(true);
          }}
          onMouseLeave={() => {
            setHowActive(false);
          }}
        >
          <p>How does it work?</p>
        </div>
        <div className="home__card"
         onMouseEnter={() => {
          setJoinActive(true);
        }}
        onMouseLeave={() => {
          setJoinActive(false);
        }}>
          <p>Join now!</p>
          <Link to={"/signup"}>Sign up now!</Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
