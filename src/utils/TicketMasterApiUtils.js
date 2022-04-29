import axios from "axios";

const BASE_URL = "https://close-around-dev.web.app"


export default {
  getVenues: (lat,lng) => axios.get(`${BASE_URL}/ticketmaster?lat=${lat}&lng=${lng}`),
  getEventsByVenue: async (venueId) =>axios.get(`${BASE_URL}/ticketmaster/${venueId}`)
};