import axios from "axios";

export default {
  getUserEvents: () => axios.get(`https://close-around-api.herokuapp.com/events`),
  addUserEvent: (event) =>axios.post(`https://close-around-api.herokuapp.com/events`,{
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
  editUserEvent: (event) =>axios.post(`https://close-around-api.herokuapp.com/events/${event.id}/edit`,{
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