import React from "react";
import { AccountProvider } from "./context/AccountContext";
import { StorageProvider } from "./context/StorageContext";

import { Wallet, Lottery, Storage } from "./components";

export const App = () => (
  <AccountProvider>
    <div className="grid2">
      <div>
        <Wallet />
        <StorageProvider>
          <Storage />
        </StorageProvider>
      </div>
      <Lottery />
    </div>
  </AccountProvider>
);
