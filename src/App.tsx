import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Auth } from "./Auth";
import { AccountProvider } from "@contexts";

import { Header } from "@components";

export const App = () => (
  <Router>
    <AccountProvider>
      <Header />
      <div className="container">
        <Auth />
      </div>
      <ToastContainer />
    </AccountProvider>
  </Router>
);
