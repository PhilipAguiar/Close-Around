import axios from "axios";

const BASE_URL = "https://close-around-dev.web.app"

export default {
<<<<<<< HEAD
  getUserEvents: () => axios.get(`http://localhost:8080/events`),
  addUserEvent: (event) =>
    axios.post(`http://localhost:8080/events`, {
      id: event.id,
      lat: event.lat,
      lng: event.lng,
      icon: event.icon,
      eventName: event.eventName,
      eventDescription: event.eventDescription,
      eventDate: event.eventDate,
      eventLocation: event.eventLocation,
      userSubmitted: event.userSubmitted,
      userAvatar: event.userAvatar,
      eventSize: event.eventSize,
      usersInterested: event.usersInterested,
    }),
  editUserEvent: (event) =>
    axios.post(`http://localhost:8080/events/${event.id}/edit`, {
      id: event.id,
      lat: event.lat,
      lng: event.lng,
      icon: event.icon,
      eventName: event.eventName,
      eventDescription: event.eventDescription,
      eventDate: event.eventDate,
      eventLocation: event.eventLocation,
      userSubmitted: event.userSubmitted,
      userAvatar: event.userAvatar,
      eventSize: event.eventSize,
      usersInterested: event.usersInterested,
    }),
};
=======
  getUserEvents: () => axios.get(`${BASE_URL}/events`),
  addUserEvent: (event) =>axios.post(`${BASE_URL}/events`,{
    id:event.id,
    lat: event.lat,
    lng: event.lng,
    icon: event.icon,
    eventName: event.eventName,
    eventDescription: event.eventDescription,
    eventDate: event.eventDate,
    eventLocation:event.eventLocation,
    userSubmitted:event.userSubmitted,
    userAvatar:event.userAvatar,
    eventSize: event.eventSize,
    usersInterested: event.usersInterested
  }),
  editUserEvent: (event) =>axios.post(`${BASE_URL}/events/${event.id}/edit`,{
    id:event.id,
    lat: event.lat,
    lng: event.lng,
    icon: event.icon,
    eventName: event.eventName,
    eventDescription: event.eventDescription,
    eventDate: event.eventDate,
    eventLocation:event.eventLocation,
    userSubmitted:event.userSubmitted,
    userAvatar:event.userAvatar,
    eventSize: event.eventSize,
    usersInterested: event.usersInterested
  })
};
>>>>>>> firebase-function
