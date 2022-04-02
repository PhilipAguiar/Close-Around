import React from "react";
import { InfoBox } from "@react-google-maps/api";
import "./InfoCard.scss";
import { useAuth } from "../../contexts/AuthContext";

const options = {
  boxStyle: {
    boxShadow: `rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px`,
    borderRadius: "40px",
    backgroundColor: "navajowhite",
    padding: "15px",
  },
  maxWidth: "1000px",
};

function InfoCard({ event, clickHandler }) {
  const { currentUser } = useAuth();
  return (
    <InfoBox position={{ lat: event.lat, lng: event.lng }} defaultOptions={{ disableAutoPan: true }} options={options}>
      <div className="event-card">
        <h2 className="event-card__heading">{event.eventName}</h2>
        <h1>{event.userSubmitted}</h1>
        <img className="event-card__user-image" src={event.userAvatar}/>
        <h3>Event Description</h3>
        <p className="event-card__description">{event.eventDescription}</p>
        <h3 className="event-card__heading">When:</h3>
        <p className="event-card__description">{event.eventDate} </p>
        <h3 className="event-card__heading">Event Size</h3>
        <p className="event-card__description">{event.usersInterested.length + "/" +event.eventSize}</p>
        <h3 className="event-card__description">People Interested</h3>
        {event.usersInterested.map((user) => {
          return (
            <div>
              <p>{user.name}</p>
              {user.userAvatar ? <img className="event-card__user-image" src={user.userAvatar} alt="" /> : null}
              
            </div>
          );
        })}
        {currentUser ? <button onClick={(e) => clickHandler(e, event)}>Join the event</button> : <p>Sign in to join the event</p>}
      </div>
    </InfoBox>
  );
}

export default InfoCard;
