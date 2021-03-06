import React from "react";
import { useState } from "react";
import "./FetchLocationModule.scss";
function FetchLocationModule({ clickHandler, loadTicketMasterEvents, loadUserEvents }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="fetch-location">
      <button
        className="fetch-location__button"
        onClick={async () => {
          await clickHandler();
          setLoading(true);

          // checks if user has approved giving their location data once a second. Loads map when user gives data.

          let checkForLocalStorage = setInterval(() => {
            if (!JSON.parse(localStorage.getItem("lat")) && !JSON.parse(localStorage.getItem("lng"))) {
            } else {
              loadTicketMasterEvents(Number(JSON.parse(localStorage.getItem("lat"))), Number(JSON.parse(localStorage.getItem("lng"))));
              loadUserEvents();
              clearInterval(checkForLocalStorage);
            }
          }, 1000);
        }}
      >
        Click here to give your location data
      </button>

      {loading && <h1>Wait one second...</h1>}
    </div>
  );
}

export default FetchLocationModule;
