import React from "react";
import EventForm from "../EventForm/EventForm";
import "./InfoSection.scss";
import logo from "../../assets/close-around-v2.png";

function InfoSection({ formActive, formSubmit, selectIcon, selected, clickHandler }) {
  return (
    <>
      <div className="info-section">
        <div className="info-section__logo-container">
        <img className="info-section__logo" src={logo} alt="logo" />
        </div>
        {formActive && <EventForm submitHandler={formSubmit} selectIcon={selectIcon} />}

        {/* {selected ? <InfoCard event={selected} clickHandler={clickHandler}></InfoCard> : null} */}
      </div>
    </>
  );
}

export default InfoSection;
