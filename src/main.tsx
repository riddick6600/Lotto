declare global {
  interface Window {
    ethereum: any;
  }
}

import React from "react";
import { App } from "./App";
import { createRoot } from "react-dom/client";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<App />);
