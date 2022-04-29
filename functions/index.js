const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const express = require("express");
const app = express();
const cors = require("cors");

// Middleware
app.use(express.static('public'))
app.use(express.json())
app.use(cors());
app.options('*', cors())
// Routes
const ticketmasterRoute = require('./routes/ticketmaster');
app.use('/ticketmaster', ticketmasterRoute);
const eventRoute = require('./routes/events');
app.use('/events', eventRoute);
console.log("test")
exports.app = functions.https.onRequest(app);