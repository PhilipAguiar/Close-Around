import "./EventForm.scss";
import basketballIcon from "../../assets/icons/basketball.svg";
import bikeIcon from "../../assets/icons/bike.svg";
import dogIcon from "../../assets/icons/dog.svg";
import footballIcon from "../../assets/icons/football.svg";
import gamingIcon from "../../assets/icons/gaming.svg";
import grillIcon from "../../assets/icons/grill.svg";
import groupAddIcon from "../../assets/icons/groupAdd.svg";
import gymnasticsIcon from "../../assets/icons/gymnastics.svg";
import hikingIcon from "../../assets/icons/hiking.svg";
import meditateIcon from "../../assets/icons/meditate.svg";
import musicIcon from "../../assets/icons/music.svg";
import nightLifeIcon from "../../assets/icons/nightLife.svg";
import paintIcon from "../../assets/icons/paint.svg";
import personAddIcon from "../../assets/icons/personAdd.svg";
import plusOneIcon from "../../assets/icons/plusOne.svg";
import runIcon from "../../assets/icons/run.svg";
import soccerIcon from "../../assets/icons/soccer.svg";
import studyIcon from "../../assets/icons/study.svg";
import tennisIcon from "../../assets/icons/tennis.svg";
import volleyballIcon from "../../assets/icons/volleyball.svg";

import React from "react";
import { useState } from "react";

function EventForm({ submitHandler, selectIcon }) {
  const clickHandler = (e) => {
    selectIcon(e.target.src);
  };

  return (
    <div className="event-form">
      <form className="event-form__container" onSubmit={submitHandler}>
        <div className="event-form__wrapper">
          <div className="event-form__input-section">
            <label className="event-form__label">What's Happening</label>
            <input className="event-form__input" name="event" />
          </div>

          <div className="event-form__input-section">
            <label className="event-form__label">Where</label>
            <input className="event-form__input" name="location" />
          </div>

          <div className="event-form__input-section">
            <label className="event-form__label">When</label>
            <input className="event-form__input" type="date" name="date" />
          </div>

          <div className="event-form__input-section">
            <label className="event-form__label">Description</label>
            <textarea className="event-form__text-area" name="description" />
          </div>
          <div className="event-form__input-section">
            <label className="event-form__label">How many people?</label>
            <input type="number" min="1" className="event-form__input" name="size" />
          </div>
        </div>
        <div className="event-form__icon-section">
          <p className="event-form__heading">Choose your icon</p>
          <div className="event-form__icon-container">
            <img src={basketballIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={bikeIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={dogIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={footballIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={gamingIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={grillIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={groupAddIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={gymnasticsIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={hikingIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={meditateIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={musicIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={nightLifeIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={paintIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={personAddIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={plusOneIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={runIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={soccerIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={studyIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={tennisIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={volleyballIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
          </div>
        </div>
        <button className="event-form__button">Submit</button>
      </form>
    </div>
  );
}

export default EventForm;
