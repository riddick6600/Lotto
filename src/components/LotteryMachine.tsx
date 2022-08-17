import React, { useContext } from "react";
import { Lottery, Input } from "../components";
import { LotteryMachineContext } from "../context/LotteryMachineContext";

export const LotteryMachine = () => {
  const {
    contract,
    balance,
    tickets,
    createTicket,
    deployMachine,
    withdrow,
    owner,
  } = useContext(LotteryMachineContext);

  const handleClick = () => {
    createTicket(
      document.querySelector("[name=price]").value,
      document.querySelector("[name=limit]").value,
      document.querySelector("[name=value]").value
    );
  };

  const handleClickDeploy = () => {
    deployMachine(document.querySelector("[name=priceMachine]").value);
  };

  return (
    <div>
      <input placeholder="Price ETH" type="number" name="priceMachine" />
      <button onClick={handleClickDeploy}>Deploy New Machine</button>
      <button onClick={withdrow}>Withdrow</button>
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
            <input placeholder="Value" type="number" name="value" />
            <button onClick={handleClick}>Create ticket</button>
          </div>
        </>
      )}
      <hr />
      <Lottery />
    </div>
  );
};
