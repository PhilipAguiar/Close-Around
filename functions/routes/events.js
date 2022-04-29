const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const getEvents = () => JSON.parse(fs.readFileSync("./data/userEvents.json", { encoding: "utf8", flag: "r" }));

const saveEvents = (events) => fs.writeFileSync("./data/userEvents.json", JSON.stringify(events));

router.get("/", (req, res) => {
  const events = getEvents();
  if (events.length === 0) {
    res.status(400).send("No events");
    return;
  }
  res.status(200).json(events);
});

router.post("/", (req, res) => {
  const events = getEvents();

  events.push({
    id: req.body.id,
    lat: req.body.lat,
    lng: req.body.lng,
    icon: req.body.icon,
    eventName: req.body.eventName,
    eventDescription: req.body.eventDescription,
    eventDate: req.body.eventDate,
    eventLocation:req.body.eventLocation,
    userSubmitted: req.body.userSubmitted,
    userAvatar:req.body.userAvatar,
    eventSize: req.body.eventSize,
    usersInterested: req.body.usersInterested
  });


  saveEvents(events);
  res.status(200).json(events);
});

router.post("/:id/edit", (req, res) => {
  const events = getEvents();

  let selectedEventExists =events.find(event=>event.id===req.params.id);
  
  if(!selectedEventExists){
    res.status(500).json("No event with that id exists");
  }

  let editedEvent = {
    id: req.body.id,
    lat: req.body.lat,
    lng: req.body.lng,
    icon: req.body.icon,
    eventName: req.body.eventName,
    eventDescription: req.body.eventDescription,
    eventDate: req.body.eventDate,
    eventLocation:req.body.eventLocation,
    userSubmitted: req.body.userSubmitted,
    userAvatar:req.body.userAvatar,
    eventSize: req.body.eventSize,
    usersInterested: req.body.usersInterested
  }
 
  let editedEvents = events.map(event=>{
    if (event.id === req.params.id) {
      return editedEvent;
    }
    return event;
  })

  saveEvents(editedEvents);
  res.status(200).json(editedEvents);
});


module.exports = router;
