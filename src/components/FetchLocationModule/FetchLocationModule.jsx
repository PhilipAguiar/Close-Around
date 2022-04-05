import React from "react";

function FetchLocationModule({ clickHandler, getTicketMasterEvents }) {
  return (
    <div>
      <button
        onClick={async () => {
          await clickHandler();

          let checkForLocalStorage = setInterval(() => {
            if (!JSON.parse(localStorage.getItem("lat")) && !JSON.parse(localStorage.getItem("lng"))) {
              console.log("test");
            } else {
              getTicketMasterEvents(Number(JSON.parse(localStorage.getItem("lat"))), Number(JSON.parse(localStorage.getItem("lng"))));
              clearInterval(checkForLocalStorage);
            }
          }, 1000);
        }}
      >
        Click here to give your data
      </button>
    </div>
  );
}

export default FetchLocationModule;
