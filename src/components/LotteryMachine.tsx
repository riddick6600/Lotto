import React, { useContext } from "react";
import { Lottery } from "@components";
import { LotteryMachineContext } from "@contexts";
import { getHash } from "@utils";

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
    <div className="machine">
      {contract && (
        <>
          <img className="slot_img" src="/slot.webp" />
          <div>LotteryMachine: {contract && getHash(contract.address)}</div>
          <div>Owner: {getHash(owner)}</div>
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
