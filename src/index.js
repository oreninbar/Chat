import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { SupportStore } from "./stores/supportStore";
import { CustomerStore } from "./stores/customerStore";
import App from "./App";

let support_store = new SupportStore();
let customer_store = new CustomerStore();

let stores = { support_store, customer_store };

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById("root")
);
