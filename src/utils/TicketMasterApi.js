import axios from "axios";

export default {
  getVenues: () => axios.get(`http://localhost:8080/ticketmaster`),
  getEventsByVenue: (venueId) =>axios.get(`http://localhost:8080/ticketmaster/${venueId}`)
};