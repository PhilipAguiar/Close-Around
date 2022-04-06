import "./EventForm.scss";
import basketballIcon from "../../assets/basketball.svg";
import groupAddIcon from "../../assets/groupAdd.svg";
import gymnasticsIcon from "../../assets/gymnastics.svg";
import personAddIcon from "../../assets/personAdd.svg";
import personRemoveIcon from "../../assets/personRemove.svg";
import plusOneIcon from "../../assets/plusOne.svg";
import React from "react";

function EventForm({ submitHandler, selectIcon,}) {
  const clickHandler = (e) => {
    selectIcon(e.target.src);
  };

  return (
    <div className="event-form">
      <form className="event-form__container" onSubmit={submitHandler}>
        <div className="event-form__wrapper">

          <label className="event-form__label">What's Happening</label>
          <input className="event-form__input" name="event" />
          
          <label className="event-form__label">Where</label>
          <input className="event-form__input" name="location" />

          <label className="event-form__label">When</label>
          <input className="event-form__input" type="date" name="date" />

          <label className="event-form__label">Description</label>
          <textarea className="event-form__text-area" name="description" />

          <label className="event-form__label">How many people?</label>
          <input type="number" min="1" className="event-form__input" name="size" />

          <div className="event-form__icon-container">
            <img src={basketballIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={groupAddIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={gymnasticsIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={personAddIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={personRemoveIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
            <img src={plusOneIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
          </div>
        </div>
        
        <button className="event-form__button">Submit</button>
      </form>
    </div>
  );
}

export default EventForm;
