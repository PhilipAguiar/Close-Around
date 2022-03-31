import "./App.scss";
import React from "react";
import MapField from "./components/MapField/MapField";
import { BrowserRouter } from "react-router-dom";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import Home from "./pages/Home/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/map" component={MapField} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
