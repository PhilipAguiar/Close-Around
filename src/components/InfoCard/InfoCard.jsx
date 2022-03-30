import React from "react";
import { InfoBox } from "@react-google-maps/api";
import "./InfoCard.scss";

const options = {
  boxStyle: {
    boxShadow: `rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px`,
    borderRadius: "40px",
    backgroundColor: "navajowhite",
    padding: "15px",
  },
  
  maxWidth: "1000px",
};

function InfoCard({ event }) {
  return (
    <InfoBox position={{ lat: event.lat, lng: event.lng }} options={options}>
      <div className="event-card">
        <h2 className="event-card__heading">{event.eventName}</h2>
        <h3>Event Description</h3>
        <p className="event-card__description">{event.eventDescription}</p>
        <h3 className="event-card__heading">When:</h3>
        <p className="event-card__description">{event.eventDate} </p>
        <h3 className="event-card__heading">People Interested:</h3>
        <p className="event-card__description">Me,Me and Me</p>
      </div>
    </InfoBox>
  );
}

export default InfoCard;
