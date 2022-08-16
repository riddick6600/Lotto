import React, { useContext } from "react";
import { TicketProvider } from "../context/TicketContext";
import { LotteryMachineContext } from "../context/LotteryMachineContext";
import { Ticket } from "./Ticket";

export const Lottery = () => {
  const { tickets } = useContext(LotteryMachineContext);
  return (
    <div>
      {tickets.map((address) => (
        <TicketProvider address={address} key={address}>
          <Ticket />
          <hr />
        </TicketProvider>
      ))}
    </div>
  );
};
