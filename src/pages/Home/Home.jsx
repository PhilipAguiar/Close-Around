import React from "react";
import "./Home.scss";
import { useState } from "react";
import { Link } from "react-router-dom";
import event from "../../assets/event.png";
import pickup from "../../assets/pickup.png";
import paintNight from "../../assets/paintNight.png";

function Home() {
  const [whatActive, setWhatActive] = useState(false);
  const [howActive, setHowActive] = useState(false);
  const [joinActive, setJoinActive] = useState(false);

  return (
    <section className="home">
      <div className="home__hero home__hero--toronto">

        {!whatActive && !howActive && !joinActive && (
          <>
            <div className="home__text-wrapper">
              <h1>Don't have plans? Not sure what to do this weekend?</h1>
              <p className="home__subheading">CloseAround helps you find fun close to home!</p>
              <Link to="/map">See whats Close Around!</Link>
            </div>
          </>
        )}

        {whatActive && (
          <>
            <div className="home__text-wrapper">
              <h1>What is Close Around?</h1>
              <p className="home__subheading">CloseAround lets you see what events and excitement are happening your neighborhood!</p>
            </div>
            <img className="home__image-2" src={paintNight} alt="" />
          </>
        )}

        {howActive && (
          <>
            <img className="home__image-3" src={pickup} alt="" />
            <div className="home__text-wrapper">
              <h1>How does Close Around Work?</h1>
              <p className="home__subheading">Close Around shows you a map populated by your community!</p>
            </div>
          </>
        )}

        {joinActive && (
          <>
            <div className="home__text-wrapper">
              <h1>You'll never know whats Close Around</h1>
              <p>Sign up now!</p>
            </div>
            <img
              className="home__image-4
            "
              src={event}
              alt=""
            />
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
          <p className="home__heading">What is it?</p>
          <p className="home__hover">Hover Me!</p>
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
          <p className="home__heading">How does it work?</p>
          <p className="home__hover">Hover Me!</p>
        </div>
        
        <div
          className="home__card"
          onMouseEnter={() => {
            setJoinActive(true);
          }}
          onMouseLeave={() => {
            setJoinActive(false);
          }}
        >
          <p className="home__heading">Join now!</p>
          <p className="home__hover">Hover Me!</p>
          <Link to={"/signup"}>Sign up now!</Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
