import axios from "axios";

const BASE_URL = "https://close-around-dev.web.app"

export default {
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
