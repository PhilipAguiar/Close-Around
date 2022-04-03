import "./EventForm.scss";
import basketballIcon from "../../assets/basketball.svg";
import groupAddIcon from "../../assets/groupAdd.svg";
import gymnasticsIcon from "../../assets/gymnastics.svg";
import personAddIcon from "../../assets/personAdd.svg";
import personRemoveIcon from "../../assets/personRemove.svg";
import plusOneIcon from "../../assets/plusOne.svg";
import React from "react";

function EventForm({submitHandler, selectIcon}) {
  const clickHandler = (e) => {
    selectIcon(e.target.src);
  };

  return (
    <>
      <form className="event-form" onSubmit={submitHandler}>
        <label>Event Name</label>
        <input className="event-form__input" name="event" />
        <label>Description</label>
        <textarea className="event-form__text-area" name="description" />
        <label>When</label>
        <input className="event-form__input" name="date" />
        <label>Event Size</label>
        <input type="number" min="0" className="event-form__input" name="size" />
        <div className="event-form__icon-container">
          <img src={basketballIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
          <img src={groupAddIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
          <img src={gymnasticsIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
          <img src={personAddIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
          <img src={personRemoveIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
          <img src={plusOneIcon} onClick={clickHandler} className="event-form__icon" alt="basketball" />
        </div>
        <button className="event-form__button">Submit</button>
      </form>
    </>
  );
}

export default EventForm;
