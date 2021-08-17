import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "../store";
import Index from "../components/index";
ReactDOM.render(
  <Provider store={store}>
    <Index />
  </Provider>,
  document.getElementById("root")
);
