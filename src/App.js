import React from "react";
import MainHeader from "./componenets/header/MainHeader";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Customer from "./componenets/customer/Customer";
import Support from "./componenets/support/Support";

function App() {
  return (
    <div className="App">
      <Router>
        <MainHeader />
        <Switch>
          <Route path="/" exact render={() => <Customer />} />
          <Route path="/admin" render={() => <Support />} />
        </Switch>
      </Router>{" "}
    </div>
  );
}

export default App;
