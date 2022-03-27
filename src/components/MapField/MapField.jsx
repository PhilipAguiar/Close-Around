import "./MapField.scss";
import React, { useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
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
  const [marker, setMarker] = useState([]);
  const [markerList, setMarkerList] = useState([])
  const [newEventActive, setNewEventActive] = useState(false);
  const [formActive, setFormActive] = useState(false);
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventIcon, setEventIcon] = useState("http://maps.google.com/mapfiles/ms/icons/red.png");

  const handlePrompt = (response) => {
    setNewEventActive(false);
    if (response) {
      setFormActive(true);
    }
  };

  const onMapClick = (e) => {
    setCurrentLat(e.latLng.lat());
    setCurrentLng(e.latLng.lng());

    if (newEventActive) {
      return setMarker({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    }
  };

  const formSubmit = (e) => {
    e.preventDefault();
    console.log(e);

    setMarkerList((current) => [
      ...current,
      {
        lat: currentLat,
        lng: currentLng,
        icon: eventIcon,
        eventName: e.target.event.value,
        eventDescription: e.target.description.value,
        eventDate: e.target.date.value,
      },
    ]);
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
      {markerList.map((marker)=>{
        <Marker
        key={uuidv4()}
        position={{ lat: marker.lat, lng: marker.lng }}
        icon={marker.icon}
      />
      })}

        {currentLat && currentLng && (
          <Marker
            key={uuidv4()}
            position={{ lat: currentLat, lng: currentLng }}
            icon={{ url: eventIcon, origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(20, 10) }}
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
      </GoogleMap>
    </div>
  );
}

export default MapField;
