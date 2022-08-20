import React, { useContext } from "react";
import {
  TicketProvider,
  CasinoContext,
  LotteryMachineProvider,
} from "@contexts";
import { Ticket } from "./Ticket";
import { LotteryMachine } from "./LotteryMachine";

export const Casino = () => {
  const { contract, owner, balance, machines, deployCasino, createMachine } =
    useContext(CasinoContext);

  return (
    <div>
      <button onClick={deployCasino}>Deploy New Casino</button>
      <div>Casino: {contract?.address}</div>
      <div>Owner: {owner}</div>
      <div>Balance: {balance}</div>
      <button onClick={createMachine}>Create new Machine</button>
      {machines.map((address) => (
        <LotteryMachineProvider address={address} key={address}>
          <LotteryMachine />
        </LotteryMachineProvider>
      ))}
    </div>
  );
};
