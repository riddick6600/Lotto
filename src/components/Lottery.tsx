import React, { useContext } from "react";
import { TicketProvider } from "../context/TicketContext";
import { LotteryMachineContext } from "../context/LotteryMachineContext";
import { Ticket } from "./Ticket";

export const Lottery = () => {
  const { tickets } = useContext(LotteryMachineContext);
  return (
    <div>
      {tickets.map((contract) => (
        <TicketProvider contract={contract} key={contract}>
          <Ticket />
          <hr />
        </TicketProvider>
      ))}
    </div>
  );
};
