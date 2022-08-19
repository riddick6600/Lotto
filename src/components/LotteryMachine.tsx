import React, { useContext } from "react";
import { Lottery } from "@components";
import { LotteryMachineContext } from "@contexts/LotteryMachineContext";

export const LotteryMachine = () => {
  const { contract, balance, tickets, createTicket, deployMachine, owner } =
    useContext(LotteryMachineContext);

  const handleClick = () => {
    createTicket(
      document.querySelector("[name=price]").value,
      document.querySelector("[name=limit]").value
    );
  };

  return (
    <div>
      <button onClick={deployMachine}>Deploy New Machine</button>
      <br />
      <br />
      <div>LotteryMachine: {contract && contract.address}</div>
      {contract && (
        <>
          <div>Owner: {owner}</div>
          <div>Balance: {balance}</div>
          <br />
          <div>
            <input placeholder="Price ETH" type="number" name="price" />
            <input placeholder="Limit players" type="number" name="limit" />
            <button onClick={handleClick}>Create ticket</button>
          </div>
        </>
      )}
      <hr />
      <Lottery />
    </div>
  );
};
