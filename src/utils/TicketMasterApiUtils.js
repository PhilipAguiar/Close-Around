import axios from "axios";

const BASE_URL = "https://close-around-dev.web.app"


export default {
<<<<<<< HEAD
  getVenues: (lat, lng) => axios.get(`http://localhost:8080/ticketmaster?lat=${lat}&lng=${lng}`),
  getEventsByVenue: async (venueId) => axios.get(`http://localhost:8080/ticketmaster/${venueId}`),
};
=======
  getVenues: (lat,lng) => axios.get(`${BASE_URL}/ticketmaster?lat=${lat}&lng=${lng}`),
  getEventsByVenue: async (venueId) =>axios.get(`${BASE_URL}/ticketmaster/${venueId}`)
};
>>>>>>> firebase-function
