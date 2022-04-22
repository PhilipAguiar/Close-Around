import axios from "axios";

export default {
  getVenues: (lat,lng) => axios.get(`https://close-around-api.herokuapp.com/ticketmaster?lat=${lat}&lng=${lng}`),
  getEventsByVenue: async (venueId) =>axios.get(`https://close-around-api.herokuapp.com/ticketmaster/${venueId}`)
};