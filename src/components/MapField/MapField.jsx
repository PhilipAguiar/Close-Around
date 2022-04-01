import "./MapField.scss";
import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { v4 as uuidv4 } from "uuid";
import mapStyle from "./mapStyles";
import NewEventPrompt from "../NewEventPrompt/NewEventPrompt";
import EventForm from "../EventForm/EventForm";
import Header from "../Header/Header";
import InfoCard from "../InfoCard/InfoCard";
import TicketMasterApiUtils from "../../utils/TicketMasterApi";
import userEventUtils from "../../utils/UserEvents";
import FetchLocationModule from "../FetchLocationModule/FetchLocationModule";
import { delay } from "lodash";

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
  const [newUserLat, setNewUserLat] = useState(null);
  const [newUserLng, setNewUserLng] = useState(null);
  const [selected, setSelected] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [newEventActive, setNewEventActive] = useState(false);
  const [newLocationActive, setNewLocationActive] = useState(false);
  const [formActive, setFormActive] = useState(false);
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);
  const [eventIcon, setEventIcon] = useState("http://maps.google.com/mapfiles/ms/icons/red.png");

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

                        const newEvent = {
                          lat: eventLat,
                          lng: eventLng,
                          icon: event.images[0].url,
                          eventName: event.name,
                          eventDescription: event.url,
                          eventDate: event.dates.start.localDate,
                        };
                        setEventList((prevList) => [...prevList, newEvent]);
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

  const getUserEvents = () =>{
   
    userEventUtils.getUserEvents().then(res=>
      res.data.forEach((event) => {
        console.log(event)
        setEventList((prevList) => [...prevList, {
          lat: event.lat,
          lng: event.lng,
          icon: event.icon,
          eventName: event.eventName,
          eventDescription: event.eventDescription,
          eventDate: event.eventDate,
        }])
    
      })
    )
  }

  const reset = () => {
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
    if (newEventActive) {
      setCurrentLat(e.latLng.lat());
      setCurrentLng(e.latLng.lng());
    }
  };

  const checkIfOverlap = (lat, lng) => {
    let output = false;
    eventList.forEach((event) => {
      if (event.lat === lat && event.lng === lng) {
        output = true;
      }
    });
    return output;
  };
  const cleanEvents = () => {
    let newArray = [];

    eventList.forEach((event, i) => {
      if (i === 1) {
        newArray.push(event);
        console.log(newArray);
        return;
      }
      newArray.forEach((newEvent) => {
        if (newEvent.lat === event.lat && newEvent.lng === event.lng) {
          newArray.push({
            lat: event.lat + (Math.random() - 0.5) / 1500,
            lng: event.lng + (Math.random() - 0.5) / 1500,
            icon: event.icon,
            eventName: event.eventName,
            eventDescription: event.eventDescription,
            eventDate: event.eventDate,
          });
        } else {
          newArray.push(event);
        }
      });
    });
    setEventList(newArray);
  };

  const formSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      lat: currentLat,
      lng: currentLng,
      icon: eventIcon,
      eventName: e.target.event.value,
      eventDescription: e.target.description.value,
      eventDate: e.target.date.value,
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

  const changeUserLocation = () => {};

  const promptLocationChange = () => {
    reset();
    setNewEventActive(true);
  };

  if (!testLat || !testLng) {
    return <FetchLocationModule clickHandler={getLocation}> getTicketMasterEvents={getTicketMasterEvents}</FetchLocationModule>;
  }

  return (
    <div className="map-field">
      {
        <div className="wrapper">
          <Header clickHandler={promptLocationChange} />
          {/* <h1>Close Around</h1>
      <h2 className="bottom"> Connecting you to your neighborhood</h2> */}
          <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={center} options={options} onClick={onMapClick} onLoad={onMapLoad}>
            {eventList.map((marker) => {
              return (
                <Marker
                  key={uuidv4()}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  icon={{ url: marker.icon, scaledSize: new window.google.maps.Size(30, 30), anchor: new window.google.maps.Point(15, 15) }}
                  onClick={() => {
                    setUserLat(marker.lat);
                    setUserLng(marker.lng);
                    setSelected(marker);
                  }}
                />
              );
            })}

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
              className="map-field__button"
              onClick={() => {
                setNewEventActive((newEventActive) => !newEventActive);
              }}
            >
              Add New Event
            </button>

            {newEventActive ? <h4 className="map-field__question">Click where you want to add an event</h4> : null}
            {newEventActive && currentLat && currentLng && <NewEventPrompt lat={currentLat} lng={currentLng} clickHandler={handlePrompt} />}
            {formActive && (
              <>
                {" "}
                <EventForm submitHandler={formSubmit} selectIcon={selectIcon} />
              </>
            )}
            {selected ? <InfoCard event={selected}></InfoCard> : null}
          </GoogleMap>
        </div>
      }
    </div>
  );
}

export default MapField;
