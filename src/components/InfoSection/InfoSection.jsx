import React from "react";
import EventForm from "../EventForm/EventForm";
import "./InfoSection.scss";
import logo from "../../assets/close-around-v2.png";

function InfoSection({ formActive, formSubmit, selectIcon, selected, clickHandler }) {
  return (
    <>
      <div className="info-section">
        {formActive && <EventForm submitHandler={formSubmit} selectIcon={selectIcon} />}
      </div>
    </>
  );
}

export default InfoSection;
