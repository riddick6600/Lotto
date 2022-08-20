import React, { useContext } from "react";
import { Lottery } from "@components";
import { LotteryMachineContext } from "@contexts";

export const LotteryMachine = () => {
  const { contract, balance, createTicket, owner } = useContext(
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
