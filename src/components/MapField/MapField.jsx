import "./MapField.scss";
import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { v4 as uuidv4 } from "uuid";
import mapStyle from "./mapStyles";
import NewEventPrompt from "../NewEventPrompt/NewEventPrompt";
import EventForm from "../EventForm/EventForm";
import Header from "../Header/Header";
import InfoCard from "../InfoCard/InfoCard";
import TicketMasterApi from "../../utils/TicketMasterApi";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100%",
  width: "100%",
};
const center = {
  lat: 43.653225,
  lng: -79.3831861,
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
  const [selected, setSelected] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [newEventActive, setNewEventActive] = useState(false);
  const [formActive, setFormActive] = useState(false);
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);
  const [eventIcon, setEventIcon] = useState("http://maps.google.com/mapfiles/ms/icons/red.png");

  useEffect(() => {
    let counter = 1;
    let apiRequestDelay = 0;

    TicketMasterApi.getVenues().then((res) => {
      res.data.forEach((venue) => {
        if (counter % 3) {
          apiRequestDelay += 400;
        }

        setTimeout(
          () =>
            TicketMasterApi.getEventsByVenue(venue.id)
              .then((res) => {
                res.data._embedded.events.forEach((event) => {
                  setEventList((prevList) => [
                    ...prevList,
                    {
                      lat: Number(event._embedded.venues[0].location.latitude),
                      lng: Number(event._embedded.venues[0].location.longitude),
                      icon: event.images[0].url,
                      eventName: event.name,
                      eventDescription: event.url,
                      eventDate: event.dates.start.localDate,
                    },
                  ]);
                });
                counter++;
              })
              .catch((e) => console.log(e)),
          apiRequestDelay
        );
      });
    });
  }, []);

  const reset = () => {
    setFormActive(false);
    setCurrentLat(null);
    setCurrentLng(null);
    setEventIcon("http://maps.google.com/mapfiles/ms/icons/red.png");
    setNewEventActive(false);
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

  const formSubmit = (e) => {
    e.preventDefault();

    setEventList((prevList) => [
      ...prevList,
      {
        lat: currentLat,
        lng: currentLng,
        icon: eventIcon,
        eventName: e.target.event.value,
        eventDescription: e.target.description.value,
        eventDate: e.target.date.value,
      },
    ]);

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

  return (
    <div className="map-field">
      <div className="wrapper">
        <Header />
        {/* <h1>Close Around</h1>
      <h2 className="bottom"> Connecting you to your neighborhood</h2> */}
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={center} options={options} onClick={onMapClick} onLoad={onMapLoad}>
          {eventList.map((marker) => {
            return (
              <Marker
                key={uuidv4()}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{ url: marker.icon, scaledSize: new window.google.maps.Size(30, 30), anchor: new window.google.maps.Point(15, 15) }}
                onClick={() => setSelected(marker)}
              />
            );
          })}

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

          {newEventActive && <h4 className="map-field__question">Click where you want to add an event</h4>}
          {newEventActive && currentLat && currentLng && <NewEventPrompt lat={currentLat} lng={currentLng} clickHandler={handlePrompt} />}
          {formActive && (
            <>
              {" "}
              <EventForm submitHandler={formSubmit} selectIcon={selectIcon} />
            </>
          )}
          {selected ? (
            <InfoCard event={selected}></InfoCard>
          ) :
          null}
        </GoogleMap>
      </div>
    </div>
  );
}

export default MapField;
