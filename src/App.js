import "./App.scss";
import React from "react";
import Map from "./pages/Map/Map";
import { BrowserRouter } from "react-router-dom";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import { AuthProvider } from "./contexts/AuthContext";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import Header from "./components/Header/Header";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/map" component={Map} />
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={Login} />
          </Switch>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
