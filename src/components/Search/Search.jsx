import React from "react";
import "./Search.scss";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import "@reach/combobox/styles.css";
import { v4 as uuidv4 } from "uuid";

function Search({ userLat, userLng, panTo, getTicketMasterEvents, setUserLocation }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => userLat, lng: () => userLng },
      radius: "20000",
    },
  });

  return (
    <div className="search">
      <Combobox
        onSelect={async (address) => {
          setValue(address, false);
          clearSuggestions();
          try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);

            setUserLocation(lat, lng);
            if (results[0].types.find((locale) => locale === "political")) {
              getTicketMasterEvents(lat, lng);
              panTo({ lat, lng }, 10);
            } else {
              getTicketMasterEvents(lat, lng);
              panTo({ lat, lng }, 14);
            }
          } catch {
            console.log("error");
          }
        }}
      >
        <ComboboxInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          disabled={!ready}
          placeholder="Search a location"
        ></ComboboxInput>

        <ComboboxPopover>
          <ComboboxList>{status === "OK" && data.map(({ id, description }) => <ComboboxOption key={uuidv4()} value={description} />)}</ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}

export default Search;
