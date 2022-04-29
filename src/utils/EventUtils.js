import TicketMasterApiUtils from "./TicketMasterApiUtils";
import userEventUtils from "./UserEventsApiUtils";
import tmLogo from "../assets/ticketmaster-logo.png"
const BASE_URL = "https://close-around-dev.web.app";

export const getTicketMasterEvents = async (lat, lng, eventList, addEvent, handleLoading, handleShowErrorMessage) => {
  // Delay is for ticketmaster api fetch limit

  let apiRequestDelay = 1000;
  handleLoading(true);
  handleShowErrorMessage(false);
  let lastVenue = false;

  setTimeout(
    () =>
      TicketMasterApiUtils.getVenues(lat, lng).then((res) => {
        apiRequestDelay += 1000;

        res.data.forEach((venue, i) => {
          setTimeout(() => {
            if (res.data.length === i + 1) {
              lastVenue = true;
            }

            TicketMasterApiUtils.getEventsByVenue(venue.id)
              .then((res) => {
                if (!res.data._embedded) {
                  handleLoading(false);
                  handleShowErrorMessage(true);
                } else {
                  res.data._embedded.events.forEach((event, j) => {
                    setTimeout(() => {
                      let eventLat = Number(event._embedded.venues[0].location.latitude) + (Math.random() - 1) / 1500;
                      let eventLng = Number(event._embedded.venues[0].location.longitude) + (Math.random() - 1) / 1500;

                      const newEvent = {
                        id: event.id,
                        lat: eventLat,
                        lng: eventLng,
                        icon: tmLogo,
                        eventName: event.name,
                        eventDescription: event.url,
                        eventDate: event.dates.start.localDate,
                        eventLocation: event._embedded.venues[0].name,
                        userSubmitted: "TicketMaster",
                        userAvatar: event.images[0].url,
                        usersInterested: [],
                      };

                      let repeatEvent = eventList.find((prevEvent) => prevEvent.id === event.id);

                      userEventUtils
                        .getUserEvents()
                        .then((res) => {
                          res.data.forEach((userEvent) => {
                            if (event.id === userEvent.id) {
                              repeatEvent = true;
                            }
                          });
                        })
                        .then(() => {
                          if (!repeatEvent) {
                            addEvent(newEvent);
                          }

                          if (lastVenue === true && j + 1 === res.data._embedded.events.length) {
                            setTimeout(() => {
                              handleLoading(false);
                            }, 4000);
                          }
                        });
                    }, 1000 * j);
                  });
                }
              })
              .catch((e) => console.log(e));
          }, apiRequestDelay * i);
        });
      }),
    apiRequestDelay
  );
};

export const getUserEvents = (addEvent) => {
  userEventUtils.getUserEvents().then((res) =>
    res.data.forEach((event) => {
      let newEvent = {
        id: event.id,
        lat: event.lat,
        lng: event.lng,
        icon: event.icon,
        eventName: event.eventName,
        eventDescription: event.eventDescription,
        eventDate: event.eventDate,
        eventLocation: event.eventLocation,
        userSubmitted: event.userSubmitted,
        userAvatar: event.userAvatar,
        eventSize: event.eventSize,
        usersInterested: event.usersInterested,
      };
      addEvent(newEvent);
    })
  );
};
