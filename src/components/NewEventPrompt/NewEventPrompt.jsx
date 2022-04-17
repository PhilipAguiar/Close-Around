import React from "react";
import "./NewEventPrompt.scss";
import { InfoWindow } from "@react-google-maps/api";

function NewEventPrompt({ lat, lng, clickHandler }) {
  return (
    <InfoWindow position={{ lat: lat, lng: lng }}>
      <div className="prompt">
        <h4 className="prompt__header">Is this where you want to add your event?</h4>

        <div className="prompt__button-wrapper">
          <button className="prompt__button" onClick={() => clickHandler(true)}>
            Yes
          </button>
          <button className="prompt__button" onClick={() => clickHandler(false)}>
            No
          </button>
        </div>
        
      </div>
    </InfoWindow>
  );
}

export default NewEventPrompt;
