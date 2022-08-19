import React from "react";
import { LotteryMachine } from "@components";
import { LotteryMachineProvider } from "@contexts";

export const Home = () => (
  <LotteryMachineProvider>
    <LotteryMachine />
  </LotteryMachineProvider>
);
