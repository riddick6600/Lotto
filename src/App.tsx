import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Auth } from "./Auth";
import { AccountProvider } from "@contexts";

import { Header } from "@components";

export const App = () => (
  <BrowserRouter>
    <AccountProvider>
      <Header />
      <div className="container">
        <Auth />
      </div>
      <ToastContainer />
    </AccountProvider>
  </BrowserRouter>
);
