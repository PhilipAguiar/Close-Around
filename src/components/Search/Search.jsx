import React from "react";
import "./Search.scss";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useCallback } from "react";

function Search({ lat, lng, panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => lat, lng: () => lng },
      radius: "200000",
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
            console.log(results);
            const { lat, lng } = await getLatLng(results[0]);
            if (results[0].types.includes("locality")) {
              panTo({ lat, lng }, 12);
            } else {
              panTo({ lat, lng }, 18);
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
        <ComboboxPopover>{status === "OK" && data.map(({ id, description }) => <ComboboxOption key={id} value={description} />)}</ComboboxPopover>
      </Combobox>
    </div>
  );
}

export default Search;
