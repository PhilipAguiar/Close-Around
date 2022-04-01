import axios from "axios";

export default {
  getUserEvents: () => axios.get(`http://localhost:8080/events`),
  addUserEvent: (event) =>axios.post(`http://localhost:8080/events`,{
    lat: event.lat,
    lng: event.lng,
    icon: event.icon,
    eventName: event.eventName,
    eventDescription: event.eventDescription,
    eventDate: event.eventDate
  })
};