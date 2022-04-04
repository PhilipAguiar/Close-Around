import React from "react";
import { InfoBox } from "@react-google-maps/api";
import "./InfoCard.scss";
import { useAuth } from "../../contexts/AuthContext";

const options = {
  boxStyle: {
    boxShadow: `rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px`,
    borderRadius: "40px",
    backgroundColor: "#00b4d8",
    padding: "15px",
    border: "2px solid #00a9d8",
    width: "400px",
    height: "500px",
  },
  margin: "0",
  alignBottom: true,
  closeBoxURL: "",
};

function InfoCard({ event, clickHandler }) {
  const { currentUser } = useAuth();
  return (
    <InfoBox position={{ lat: event.lat, lng: event.lng }} defaultOptions={{ disableAutoPan: true }} options={options}>
      <div className="event-card">
        <h1 className="event-card__heading">{event.eventName}</h1>
        <div className="event-card__info-wrapper">
          <h3>Submitted By:{event.userSubmitted}</h3>
          <img className="event-card__user-image" src={event.userAvatar} alt="user" />
        </div>
        <div className="event-card__info-wrapper">
          <h3 className="event-card__subheading">Event Description: </h3>
          <p className="event-card__description">{event.eventDescription}</p>
        </div>
        <div className="event-card__info-wrapper">
          <h3 className="event-card__subheading">When:</h3>
          <p className="event-card__description">{event.eventDate} </p>
        </div>
        <div className="event-card__info-wrapper">
          <h3 className="event-card__subheading">Event Size: n </h3>
          <p className="event-card__description">{event.usersInterested.length + "/" + event.eventSize}</p>
        </div>
        <h3 className="event-card__subheading">People Interested:</h3>
        {event.usersInterested.map((user) => {
          return (
            <div className="event-card__info-wrapper">
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
