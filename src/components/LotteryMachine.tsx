import React, { useContext } from "react";
import { TicketProvider } from "../context/TicketContext";
import { LotteryMachineContext } from "../context/LotteryMachineContext";

export const LotteryMachine = () => {
  const { contract, balance, tickets, createTicket } = useContext(
    LotteryMachineContext
  );

  const handleClick = () => {
    createTicket(
      document.querySelector("[name=price]").value,
      document.querySelector("[name=limit]").value
    );
  };

  return (
    <div>
      <div>LotteryMachine: {contract}</div>
      <div>Balance: {balance}</div>
      <div>
        <input placeholder="Price ETH" type="number" name="price" />
        <input placeholder="Limit players" type="number" name="limit" />
        <button onClick={handleClick}>Create ticket</button>
      </div>
      <hr />
      <div>Tickets:</div>
      <hr />
    </div>
  );
};
