import "./MapField.scss";
import React, { useState } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { v4 as uuidv4 } from "uuid";
import mapStyle from "./mapStyles";
import basketballIcon from "../../assets/basketball.svg";
import NewEventPrompt from "../NewEventPrompt/NewEventPrompt";
import EventForm from "../EventForm/EventForm";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: 43.653225,
  lng: -79.383186,
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

  const reset = () => {
    setFormActive(false);
    setCurrentLat(null)
    setCurrentLng(null)
    setEventIcon("http://maps.google.com/mapfiles/ms/icons/red.png")
    setNewEventActive(false)
  };

  const handlePrompt = (response) => {
    setNewEventActive(false);
    if (response) {
      setFormActive(true);
    }
  };

  const onMapClick = (e) => {
    setCurrentLat(e.latLng.lat());
    setCurrentLng(e.latLng.lng());
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
      {/* <h1>Close Around</h1>
      <h2 className="bottom"> Connecting you to your neighborhood</h2> */}
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={center} options={options} onClick={onMapClick} onLoad={onMapLoad}>
        {eventList.map((marker) => {
          return <Marker key={uuidv4()} position={{ lat: marker.lat, lng: marker.lng }} icon={{url:marker.icon,anchor: new window.google.maps.Point(15, 15)}} onClick={()=>setSelected(marker)} />;
        })}

        {currentLat && currentLng && (
          <Marker
            key={uuidv4()}
            position={{ lat: currentLat, lng: currentLng }}
            icon={{ url: eventIcon, 
              scaledSize:new window.google.maps.Size(30,30),
              origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(15, 15) }}
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
        {selected ? <InfoWindow position={{lat:selected.lat,lng: selected.lng}}>
        <div className="event-card">
            <h2 className="event-card__heading">{selected.eventName}</h2>
            <h3>Event Description</h3>
            <p className="event-card__description">{selected.eventDescription}</p>
            <h3 className="event-card__heading">When:</h3>
            <p className="event-card__description">{selected.eventDate} </p>
            <h3 className="event-card__heading">People Interested:</h3>
            <p className="event-card__description">Me,Me and Me</p>
          </div>
          </InfoWindow> :null}
      </GoogleMap>
    </div>
  );
}

export default MapField;
