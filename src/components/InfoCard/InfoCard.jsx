import React from "react";
import { InfoBox } from "@react-google-maps/api";
import "./InfoCard.scss";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const options = {
  boxStyle: {
    display: "flex",
    justifyContent: "center",
    boxShadow: `rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px`,
    borderRadius: "40px",
    backgroundColor: "#3088E6",
    padding: "15px",
    border: "7px solid #1d63ae",
    maxWidth: "400px",
    maxHeight: "80vh",
  },
  margin: "0",
  alignBottom: true,
  closeBoxURL: "",
};

const convertDate = (dateString) => {
  let splitDate = dateString.split("-");
  let date = new Date(splitDate[0] , splitDate[1]-1 , splitDate[2]);

  return date.toDateString()
};

function InfoCard({ event, clickHandler }) {
  const { currentUser } = useAuth();
  let fromEventApi = false;
  let numUsersInterested = 0;

  let userJoinedEvent = false
   

  const toggleJoinButton = () =>{
    
    userJoinedEvent = !userJoinedEvent;
  
  }


  if (event.usersInterested) {
    numUsersInterested = event.usersInterested.length;
    userJoinedEvent = event.usersInterested.find((event)=>{
      return event.id === currentUser.uid
    })
  }

  if (event.userSubmitted === "TicketMaster") {
    fromEventApi = true;
  }

  return (
    <InfoBox position={{ lat: event.lat, lng: event.lng }} defaultOptions={{ disableAutoPan: true }} options={options}>
      <div className="event-card">
        <h1 className="event-card__heading">{event.eventName}</h1>

        <div className="event-card__info-wrapper">
          <h4 className="event-card__subheading event-card__subheading--user">Submitted By: {event.userSubmitted}</h4>
          <img className="event-card__user-image event-card__user-image--submitted" src={event.userAvatar} alt="user" />
        </div>

        <div className="event-card__info-wrapper">
          <h4 className="event-card__subheading event-card__subheading--user">Location: {event.eventLocation}</h4>
        
        </div>

        <div className="event-card__info-wrapper event-card__info-wrapper--description">
          <h3 className="event-card__subheading">Event Description: </h3>
          <div className="event-card__description-container">
            {/* Check if from Api so description will be a link */}
            {fromEventApi ? (
              <a className="event-card__link event-card__info-wrapper--description" href={event.eventDescription}>
                <p className="event-card__text event-card__text--description">{event.eventDescription}</p>
              </a>
            ) : (
              <p className="event-card__text event-card__text--description">{event.eventDescription}</p>
            )}
          </div>
        </div>

        <div className="event-card__info-wrapper">
          <h3 className="event-card__subheading">When:</h3>
          <p className="event-card__text">{convertDate(event.eventDate)} </p>
        </div>

        <div className="event-card__info-wrapper">
          <h3 className="event-card__subheading">Event Size: </h3>
          <p className="event-card__text">{!event.eventSize ? `${numUsersInterested} people interested` : numUsersInterested + "/" + event.eventSize}</p>
        </div>

        <h3 className="event-card__subheading">People Interested:</h3>
        {console.log(event.usersInterested)}
        <ul className="event-card__list-wrapper">
          {event.usersInterested &&
            event.usersInterested.map((user,i) => {
              return (
                <li key={i} className="event-card__list-item">
                  <p>{user.name}</p>
                  {user.userAvatar ? <img className="event-card__user-image" src={user.userAvatar} alt="" /> : null}
                </li>
              );
            })}
        </ul>
        {currentUser ? <button className="event-card__button" onClick={(e) => {
          toggleJoinButton()
          clickHandler(e, event)}}>
          {userJoinedEvent ? "Leave the event" : "Join the event"}
          </button> : <Link to={"/login"}>Log in to join the event</Link>}
      </div>
    </InfoBox>
  );
}

export default InfoCard;
