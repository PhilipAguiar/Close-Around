import React from 'react'
import { InfoWindow } from '@react-google-maps/api'

function InfoCard({event}) {
  return (
    <InfoWindow position={{ lat: event.lat, lng: event.lng }} options={"width:100px"}>
              <div className="event-card">
                <h2 className="event-card__heading">{event.eventName}</h2>
                <h3>Event Description</h3>
                <p className="event-card__description">{event.eventDescription}</p>
                <h3 className="event-card__heading">When:</h3>
                <p className="event-card__description">{event.eventDate} </p>
                <h3 className="event-card__heading">People Interested:</h3>
                <p className="event-card__description">Me,Me and Me</p>
              </div>
            </InfoWindow>
  )
}

export default InfoCard