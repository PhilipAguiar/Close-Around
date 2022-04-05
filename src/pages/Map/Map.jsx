import "./Map.scss";
import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker, MarkerClusterer, useGoogleMap } from "@react-google-maps/api";
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
import defaultUserImage from "../../assets/default-user.svg";

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
  const { currentUser } = useAuth();

  useEffect(() => {
    if (userLat && userLng) {
      getTicketMasterEvents(testLat, testLng);
      getUserEvents();
    }
  }, []);

  const panTo = useCallback(({ lat, lng }, zoom) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(zoom);
  }, []);

  const getLocation = async () => {
    navigator.geolocation.getCurrentPosition((position) => {
      localStorage.setItem("lat", JSON.stringify(position.coords.latitude));
      localStorage.setItem("lng", JSON.stringify(position.coords.longitude));
      setUserLat(Number(JSON.stringify(position.coords.latitude)));
      setUserLng(Number(JSON.stringify(position.coords.longitude)));
    });
  };

  const getTicketMasterEvents = async (lat, lng) => {
    let apiRequestDelay = 1000;
    setLoading(true);

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
                  res.data._embedded.events.forEach((event, j) => {
                    setTimeout(() => {
                      let eventLat = Number(event._embedded.venues[0].location.latitude) + (Math.random() - 0.5) / 1500;
                      let eventLng = Number(event._embedded.venues[0].location.longitude) + (Math.random() - 0.5) / 1500;

                      const newEvent = {
                        id: event.id,
                        lat: eventLat,
                        lng: eventLng,
                        icon: "http://localhost:8080/images/ticketmaster-logo.png",
                        eventName: event.name,
                        eventDescription: event.url,
                        eventDate: event.dates.start.localDate,
                        userSubmitted: "TicketMaster",
                        usersInterested: [],
                      };

                      const repeatEvent = eventList.find((prevEvent) => prevEvent.id === event.id);

                      if (!repeatEvent) {
                        setEventList((prevList) => [...prevList, newEvent]);
                      }

                      if (lastVenue === true && j + 1 === res.data._embedded.events.length) {
                        setLoading(false);
                      }
                    }, 1000 * j);
                  });
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
        let userPhoto = "http://localhost:8080/images/default-user.svg";
        let userName = "";
        if (currentUser) {
          userName = currentUser.displayName;
          userPhoto = "http://localhost:8080/images/default-user.svg";
        }

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
            userSubmitted: userName,
            userAvatar: userPhoto,
            eventSize: 1,
            usersInterested: event.usersInterested,
          },
        ]);
      })
    );
  };

  const reset = () => {
    setNewLocationActive(false);
    setNewEventActive((newEventActive) => (newEventActive = false));
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

    const newEvent = {
      id: uuidv4(),
      lat: currentLat,
      lng: currentLng,
      icon: eventIcon,
      eventName: e.target.event.value,
      eventDescription: e.target.description.value,
      eventDate: e.target.date.value,
      userSubmitted: currentUser.displayName,
      userAvatar: currentUser.photoURL,
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
    e.preventDefault();
    const copy = [...eventList];
    const index = copy.findIndex((event) => currentEvent.id === event.id);
    let newUsersInterested;
    if (
      currentEvent.usersInterested.find((user) => {
        return user.id === currentUser.uid;
      })
    ) {
      const index = currentEvent.usersInterested.findIndex((user) => user.id === currentUser.uid);
      newUsersInterested = [copy[index].usersInterested.splice(index, index + 1)];
    } else {
      newUsersInterested = [...copy[index].usersInterested, { name: currentUser.displayName, id: currentUser.uid, userAvatar: currentUser.photoURL }];
    }

    copy[index] = {
      ...copy[index],
      usersInterested: newUsersInterested,
    };
    userEventUtils.editUserEvent(copy[index]);
    setEventList(copy);
    setSelected(copy[index]);
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
    }
  };

  if (!JSON.parse(localStorage.getItem("lat")) || !JSON.parse(localStorage.getItem("lng"))) {
    return (
      <FetchLocationModule clickHandler={getLocation} getTicketMasterEvents={getTicketMasterEvents}>
      </FetchLocationModule>
    );
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
              <MarkerClusterer
                maxZoom={15}
                // styles={[
                //   {
                //     url: "http://localhost:8080/cluster/marker.gif",
                //     soz
                //   },
                //   {
                //     url: "http://localhost:8080/cluster/marker.gif",
                //   },
                //   {
                //     url: "http://localhost:8080/cluster/marker.gif",
                //   },
                //   {
                //     url: "http://localhost:8080/cluster/marker.gif",
                //   },
                //   {
                //     url: "http://localhost:8080/cluster/marker.gif",
                //   },
                // ]}
              >
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
                />
              )}
              <button
                className="map-field__add-button"
                onClick={() => {
                  reset();
                  setNewEventActive((newEventActive) => !newEventActive);
                }}
              >
                Add New Event
              </button>

              <button className="map-field__change-button" onClick={promptLocationChange}>
                Change Location
              </button>

              {newEventActive ? <h4 className="map-field__question">Click where you want to add an event</h4> : null}

              {newLocationActive ? <h4 className="map-field__question">Click where you want to see whats Close Around</h4> : null}

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
