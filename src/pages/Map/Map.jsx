import "./Map.scss";
import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker, MarkerClusterer } from "@react-google-maps/api";
import { v4 as uuidv4 } from "uuid";
import mapStyle from "./mapStyles";
import NewEventPrompt from "../../components/NewEventPrompt/NewEventPrompt";
import EventForm from "../../components/EventForm/EventForm";
import InfoCard from "../../components/InfoCard/InfoCard";
import TicketMasterApiUtils from "../../utils/TicketMasterApi";
import userEventUtils from "../../utils/UserEvents";
import FetchLocationModule from "../../components/FetchLocationModule/FetchLocationModule";
import { useAuth } from "../../contexts/AuthContext";
import NewLocationPrompt from "../../components/NewLocationPrompt/NewLocationPrompt";
import Search from "../../components/Search/Search";
import { useCallback } from "react";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100%",
  width: "100%",
};

const options = {
  styles: mapStyle,
  disableDefaultUI: true,
  zoomControl: true,
  keyboardShortcuts: false,
};

function MapField() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  let testLat = JSON.parse(localStorage.getItem("lat"));
  let testLng = JSON.parse(localStorage.getItem("lng"));

  const [userLat, setUserLat] = useState(testLat);
  const [userLng, setUserLng] = useState(testLng);
  const [selected, setSelected] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [newEventActive, setNewEventActive] = useState(false);
  const [newLocationActive, setNewLocationActive] = useState(false);
  const [formActive, setFormActive] = useState(false);
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);
  const [loading, setLoading] = useState(false);
  const [eventIcon, setEventIcon] = useState("http://maps.google.com/mapfiles/ms/icons/red.png");
  const [loginError, setLoginError] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (userLat && userLng) {
      getUserEvents();
      getTicketMasterEvents(testLat, testLng);
      console.log(currentUser)
    }
  }, []);

  const panTo = useCallback(({ lat, lng }, zoom) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(zoom);
  }, []);

  // Gets users location and saves it into local storage

  const getLocation = async () => {
    navigator.geolocation.getCurrentPosition((position) => {
      localStorage.setItem("lat", JSON.stringify(position.coords.latitude));
      localStorage.setItem("lng", JSON.stringify(position.coords.longitude));
      setUserLat(Number(JSON.stringify(position.coords.latitude)));
      setUserLng(Number(JSON.stringify(position.coords.longitude)));
    });
  };

  const getTicketMasterEvents = async (lat, lng) => {
    // Delay is for ticketmaster api fetch limit

    let apiRequestDelay = 1000;
    setLoading(true);
    setShowErrorMessage(false);
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
                    setLoading(false);
                    setShowErrorMessage(true);
                  } else {
                    res.data._embedded.events.forEach((event, j) => {
                      setTimeout(() => {
                        let eventLat = Number(event._embedded.venues[0].location.latitude) + (Math.random() - 1) / 1500;
                        let eventLng = Number(event._embedded.venues[0].location.longitude) + (Math.random() - 1) / 1500;

                        const newEvent = {
                          id: event.id,
                          lat: eventLat,
                          lng: eventLng,
                          icon: "http://localhost:8080/images/ticketmaster-logo.png",
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
                              setEventList((prevList) => [...prevList, newEvent]);
                            }

                            if (lastVenue === true && j + 1 === res.data._embedded.events.length) {
                              setTimeout(() => {
                                setLoading(false);
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

  const getUserEvents = () => {
    userEventUtils.getUserEvents().then((res) =>
      res.data.forEach((event) => {
        setEventList((prevList) => [
          ...prevList,
          {
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
          },
        ]);
      })
    );
  };

  const reset = () => {
    setNewLocationActive(false);
    setNewEventActive(false);
    setFormActive(false);
    setCurrentLat(null);
    setCurrentLng(null);
    setEventIcon("http://maps.google.com/mapfiles/ms/icons/red.png");
  };

  const handlePrompt = (response) => {
    setNewEventActive(false);
    if (response) {
      setFormActive(true);
    }
  };

  const onMapClick = (e) => {
    if (newEventActive || newLocationActive) {
      setCurrentLat(e.latLng.lat());
      setCurrentLng(e.latLng.lng());
    }
    setSelected(null);
  };

  const formSubmit = (e) => {
    e.preventDefault();

    let userPhoto = "http://localhost:8080/images/default-user.svg";

    if (currentUser.photoURL) {
      userPhoto = currentUser.photoURL;
    }

    const newEvent = {
      id: uuidv4(),
      lat: currentLat,
      lng: currentLng,
      icon: eventIcon,
      eventName: e.target.event.value,
      eventDescription: e.target.description.value,
      eventDate: e.target.date.value,
      eventLocation: e.target.location.value,
      userSubmitted: currentUser.displayName,
      userAvatar: userPhoto,
      eventSize: e.target.event.size,
      usersInterested: [],
    };
    userEventUtils.addUserEvent(newEvent);

    setEventList((prevList) => [...prevList, newEvent]);

    reset();
  };

  const selectIcon = (icon) => {
    setEventIcon(icon);
  };

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);
  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  const center = {
    lat: userLat,
    lng: userLng,
  };

  const joinEvent = (e, currentEvent) => {
   
    console.log(currentUser)
    e.preventDefault();
    const copy = [...eventList];
    const eventIndex = copy.findIndex((event) => currentEvent.id === event.id);
    let newUsersInterested;

    if (currentEvent.usersInterested) {
      if (
        currentEvent.usersInterested.find((user) => {
          return user.id === currentUser.uid;
        })
      ) {
        const userIndex = currentEvent.usersInterested.findIndex((user) => user.id === currentUser.uid);

        if (copy[eventIndex].usersInterested) {
          copy[eventIndex].usersInterested.splice(userIndex, 1);

          newUsersInterested = copy[eventIndex].usersInterested;
        }
      } else {
        newUsersInterested = [
          ...copy[eventIndex].usersInterested,
          { name: currentUser.displayName, id: currentUser.uid, userAvatar: currentUser.photoURL },
        ];
      }
    } else {
      newUsersInterested = [{ name: currentUser.displayName, id: currentUser.uid, userAvatar: currentUser.photoURL }];
    }

    copy[eventIndex] = {
      ...copy[eventIndex],
      usersInterested: newUsersInterested,
    };

    // Create instance of event in backend if it contains joined users

    if (currentEvent.userSubmitted === "TicketMaster") {
      userEventUtils.getUserEvents().then((res) => {
        if (
          !res.data.find((event) => {
            return event.id === currentEvent.id;
          })
        ) {
          copy[eventIndex] = { ...copy[eventIndex], userSubmitted: "TicketMaster" };
          userEventUtils.addUserEvent(copy[eventIndex]);
        } else {
          userEventUtils.editUserEvent(copy[eventIndex]);
        }
      });
    } else {
      userEventUtils.editUserEvent(copy[eventIndex]);
    }

    setEventList(copy);
    setSelected(copy[eventIndex]);
  };

  const promptLocationChange = () => {
    reset();
    setNewLocationActive(true);
  };

  const setUserLocation = async (lat, lng) => {
    setUserLat(lat);
    setUserLng(lng);
  };

  const getEvents = (response) => {
    setNewLocationActive(false);
    if (response === true) {
      setUserLat(currentLat);
      setUserLng(currentLng);
      getTicketMasterEvents(currentLat, currentLng);
      getUserEvents();
      reset();
    }
  };

  if (!JSON.parse(localStorage.getItem("lat")) || !JSON.parse(localStorage.getItem("lng"))) {
    return <FetchLocationModule clickHandler={getLocation} getTicketMasterEvents={getTicketMasterEvents}></FetchLocationModule>;
  }

  return (
    <div className="map-field">
      {
        <div className="wrapper">
          <div className="test">
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={center} options={options} onClick={onMapClick} onLoad={onMapLoad}>
              {loading && <LoadingScreen />}
              <Search
                userLat={userLat}
                userLng={userLng}
                panTo={panTo}
                getTicketMasterEvents={getTicketMasterEvents}
                setUserLocation={setUserLocation}
              />
              <MarkerClusterer maxZoom={15}>
                {(clusterer) =>
                  eventList.map((event, i) => {
                    let iconSize = 30;

                    if (event.userSubmitted === "TicketMaster") {
                      iconSize = 20;
                    }
                    return (
                      <Marker
                        key={uuidv4()}
                        position={{ lat: event.lat, lng: event.lng }}
                        icon={{
                          url: event.icon,
                          scaledSize: new window.google.maps.Size(iconSize, iconSize),
                          anchor: new window.google.maps.Point(iconSize / 2, iconSize / 2),
                        }}
                        animation={loading ? 1 : 2}
                        onClick={() => {
                          panTo({ lat: event.lat, lng: event.lng }, 12);
                          setSelected(event);
                        }}
                        clusterer={clusterer}
                      />
                    );
                  })
                }
              </MarkerClusterer>
              {/* {getUserEvents()} */}

              {currentLat && currentLng && (
                <Marker
                  key={uuidv4()}
                  position={{ lat: currentLat, lng: currentLng }}
                  icon={{
                    url: eventIcon,
                    scaledSize: new window.google.maps.Size(30, 30),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(15, 15),
                  }}
                  animation={1}
                />
              )}
              <div className="map-field__button-container">
                <button
                  className="map-field__add-button"
                  onClick={() => {
                    reset();
                    if (currentUser) {
                      setNewEventActive((newEventActive) => !newEventActive);
                    } else setLoginError(true);
                  }}
                  disabled={loading}
                >
                  Add New Event
                </button>

                <button className="map-field__change-button" onClick={promptLocationChange} disabled={loading}>
                  New Location?
                </button>
              </div>

              {loginError && <h4 className="map-field__question">Please Log in to add an event!</h4>}

              {newEventActive && <h4 className="map-field__question">Click where you want to add an event</h4>}

              {showErrorMessage && <h4 className="map-field__question">{`No TicketMaster events in this area :(`}</h4>}

              {newLocationActive ? <h4 className="map-field__question">Click where you want to search around</h4> : null}

              {newEventActive && currentLat && currentLng && <NewEventPrompt lat={currentLat} lng={currentLng} clickHandler={handlePrompt} />}

              {newLocationActive && currentLat && currentLng && <NewLocationPrompt lat={currentLat} lng={currentLng} clickHandler={getEvents} />}

              {selected ? <InfoCard event={selected} clickHandler={joinEvent}></InfoCard> : null}
            </GoogleMap>
          </div>
          {formActive && (
            <EventForm formActive={formActive} submitHandler={formSubmit} selectIcon={selectIcon} selected={selected} clickHandler={joinEvent} />
          )}
        </div>
      }
    </div>
  );
}

export default MapField;
