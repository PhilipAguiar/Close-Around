import React from 'react'
import "./NewLocationPrompt.scss";
import { InfoWindow } from "@react-google-maps/api";
function NewLocationPrompt({lat,lng,clickHandler}) {
  return (
    <InfoWindow position={{ lat: lat, lng: lng }}>
      <div className="prompt">
        <h4 className="prompt__header">Find whats Close Around here?</h4>
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

export default NewLocationPrompt