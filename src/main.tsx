declare global {
  interface Window {
    ethereum: any;
  }
}

import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(<App />, document.getElementById("root"));
