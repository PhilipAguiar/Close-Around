import axios from "axios";

export default {
  getVenues: (lat, lng) => axios.get(`http://localhost:8080/ticketmaster?lat=${lat}&lng=${lng}`),
  getEventsByVenue: async (venueId) => axios.get(`http://localhost:8080/ticketmaster/${venueId}`),
};
