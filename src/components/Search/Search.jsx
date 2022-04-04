import React from "react";
import "./Search.scss";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useCallback } from "react";

function Search({ lat, lng, mapRef }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat:()=> lat, lng:()=> lng },
      radius: "20000",
    },
  });

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
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
            panTo({ lat, lng });
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
