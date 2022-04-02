import "./MapField.scss";
import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker, MarkerClusterer } from "@react-google-maps/api";
import { v4 as uuidv4 } from "uuid";
import mapStyle from "./mapStyles";
import NewEventPrompt from "../../components/NewEventPrompt/NewEventPrompt";
import EventForm from "../../components/EventForm/EventForm";
import Header from "../../components/Header/Header";
import InfoCard from "../../components/InfoCard/InfoCard";
import TicketMasterApiUtils from "../../utils/TicketMasterApi";
import userEventUtils from "../../utils/UserEvents";
import FetchLocationModule from "../../components/FetchLocationModule/FetchLocationModule";
import { delay } from "lodash";
import { useAuth } from "../../contexts/AuthContext";
import NewLocationPrompt from "../../components/NewLocationPrompt/NewLocationPrompt";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100%",
  width: "100%",
};

const options = {
  styles: mapStyle,
  disableDefaultUI: true,
  zoomControl: true,
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
  const [zoom, setZoom] = useState(12);
  const [selected, setSelected] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [newEventActive, setNewEventActive] = useState(false);
  const [newLocationActive, setNewLocationActive] = useState(false);
  const [formActive, setFormActive] = useState(false);
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);
  const [eventIcon, setEventIcon] = useState("http://maps.google.com/mapfiles/ms/icons/red.png");
  const { currentUser } = useAuth();

  useEffect(() => {
    getTicketMasterEvents();
    getUserEvents();
  }, []);

  const getLocation = async () => {
    await navigator.geolocation.getCurrentPosition((position) => {
      localStorage.setItem("lat", JSON.stringify(position.coords.latitude));
      localStorage.setItem("lng", JSON.stringify(position.coords.longitude));
    });
  };

  const getTicketMasterEvents = () => {
    let apiRequestDelay = 1000;
    delay(
      () =>
        TicketMasterApiUtils.getVenues(userLat, userLng).then((res) => {
          apiRequestDelay += 1000;
          res.data.forEach((venue) => {
            apiRequestDelay += 1000;

            delay(
              () =>
                TicketMasterApiUtils.getEventsByVenue(venue.id)
                  .then((res) => {
                    res.data._embedded.events.forEach((event, i) => {
                      delay(() => {
                        let eventLat = Number(event._embedded.venues[0].location.latitude) + (Math.random() - 0.5) / 1500;
                        let eventLng = Number(event._embedded.venues[0].location.longitude) + (Math.random() - 0.5) / 1500;
                        console.log(event);
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

                        if (
                          !eventList.find((prevEvent) => {
                            return prevEvent.id === event.name;
                          })
                        ) {
                          setEventList((prevList) => [...prevList, newEvent]);
                        }
                      }, 1000 * i);
                    });
                  })
                  .catch((e) => console.log(e)),
              apiRequestDelay
            );
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
            userSubmitted: currentUser.displayName,
            userAvatar: currentUser.photoURL,
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
      eventSize: 1,
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
    console.log(copy[index]);
    userEventUtils.editUserEvent(copy[index]);
    setEventList(copy);
    setSelected(copy[index]);
  };

  const promptLocationChange = () => {
    reset();
    setNewLocationActive(true);
  };

  const changeLocation = (response) => {
    setNewLocationActive(false);
    if (response === true) {
      setUserLat(currentLat);
      setUserLng(currentLng);
      getTicketMasterEvents();
    }
  };

  if (!testLat || !testLng) {
    return <FetchLocationModule clickHandler={getLocation}> getTicketMasterEvents={getTicketMasterEvents}</FetchLocationModule>;
  }

  return (
    <div className="map-field">
      {
        <div className="wrapper">
          <Header />
          {/* <h1>Close Around</h1>
      <h2 className="bottom"> Connecting you to your neighborhood</h2> */}
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={zoom}
            center={center}
            onZoomChanged={() => {
              setZoom(zoom);
            }}
            options={options}
            onClick={onMapClick}
            onLoad={onMapLoad}
          >
            <MarkerClusterer
              // styles={[
              //   {
              //     url: "http://localhost:8080/cluster/Cluster1.svg",
              //   },
              //   {
              //     url: "http://localhost:8080/cluster/Cluster1.svg",
              //   },
              //   {
              //     url: "http://localhost:8080/cluster/Cluster1.svg",
              //   },
              //   {
              //     url: "http://localhost:8080/cluster/Cluster1.svg",
              //   },
              //   {
              //     url: "http://localhost:8080/cluster/Cluster1.svg",
              //   },
              // ]}
            >
              {(clusterer) =>
                eventList.map((event) => {
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
                      onClick={() => {
                        setUserLat(event.lat);
                        setUserLng(event.lng);
                        setZoom(12);
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
                setNewEventActive((newEventActive) => !newEventActive);
              }}
            >
              Add New Event
            </button>

            <button className="map-field__change-button" onClick={promptLocationChange}>
              Change Location
            </button>

            {newEventActive ? <h4 className="map-field__question">Click where you want to add an event</h4> : null}

            {newEventActive && currentLat && currentLng && <NewEventPrompt lat={currentLat} lng={currentLng} clickHandler={handlePrompt} />}

            {newLocationActive && currentLat && currentLng && <NewLocationPrompt lat={currentLat} lng={currentLng} clickHandler={changeLocation} />}

            {formActive && (
              <>
                <EventForm submitHandler={formSubmit} selectIcon={selectIcon} />
              </>
            )}
            {selected ? <InfoCard event={selected} clickHandler={joinEvent}></InfoCard> : null}
          </GoogleMap>
        </div>
      }
    </div>
  );
}

export default MapField;
