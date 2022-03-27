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
  const [newEventActive, setNewEventActive] = useState(false);
  const [formActive,setFormActive] = useState(false)
  const [currentLat, setCurrentLat] = React.useState(null);
  const [currentLng, setCurrentLng] = React.useState(null);

  const handlePrompt = (response) =>{
    setNewEventActive(false)
    if(response){
      setNewEventActive(true)
      setFormActive(true)
    }
  }

  const onMapClick = (e) => {
    setCurrentLat(e.latLng.lat());
    setCurrentLng(e.latLng.lng());
    
    if (newEventActive) {
      return setMarker(
        <Marker
          key={uuidv4()}
          position={{ lat: e.latLng.lat(), lng: e.latLng.lng() }}
          icon={{
            url:"http://maps.google.com/mapfiles/ms/icons/red.png",
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(10, 10),
          }}
        />
      );
    }
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
        {marker}
        <button
          className="map-field__button"
          onClick={() =>{
            setNewEventActive((newEventActive) => !newEventActive)
          }}
        >
          Add New Event
        </button>

        {newEventActive && <h4 className="map-field__question">Click where you want to add an event</h4>}
        {newEventActive && currentLat && currentLng && (
          <NewEventPrompt lat={currentLat} lng = {currentLng} clickHandler = {handlePrompt}/>
        )}
        {formActive && <EventForm />}
      </GoogleMap>
    </div>
  );
}

export default MapField;
