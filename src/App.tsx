import React from "react";
import { AccountProvider } from "./context/AccountContext";
import { StorageProvider } from "./context/StorageContext";
import { LotteryMachineProvider } from "./context/LotteryMachineContext";

import { Wallet, LotteryMachine, Lottery, Storage } from "./components";

export const App = () => (
  <AccountProvider>
    <div className="grid2">
      <div>
        <Wallet />
        <StorageProvider>
          <Storage />
        </StorageProvider>
      </div>
      <div>
        <LotteryMachineProvider>
          <LotteryMachine />
        </LotteryMachineProvider>
      </div>
    </div>
  </AccountProvider>
);
