import axios from "axios";

export default {
  getEvent: () => axios.get(`http://localhost:8080/ticketmaster`),
  
};