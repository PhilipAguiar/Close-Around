const express = require("express");
const router = express.Router();
const axios = require("axios");

const BASE_URL = "https://app.ticketmaster.com/";
const API_KEY = "ITWvRMBQUpQuDn6octJPGuaWxlrwOcxT";

router.get("/", (req, res) => {
  let lat = req.query.lat;
  let lng = req.query.lng;

  axios.get(`${BASE_URL}discovery/v2/suggest?latlong=${lat},${lng}&apikey=${API_KEY}&size=5&radius=100`).then((axiosRes) => {
    res.status(200).json(axiosRes.data._embedded.venues);
  });
});

router.get("/:id", (req, res) => {
  try {
    axios.get(`${BASE_URL}discovery/v2/events.json?size=5&apikey=${API_KEY}&venueId=${req.params.id}`).then((axiosRes) => {
      res.status(200).json(axiosRes.data);
    });
  } catch {
    console.log("error");
    res.status(500).json("error receiving ticketmaster data");
  }
});

module.exports = router;
