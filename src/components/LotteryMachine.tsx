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
    <div className="machine">
      {contract && (
        <>
          <div>
            LotteryMachine: ...{contract && contract.address.substr(-6)}
          </div>
          <div>Owner: ...{owner.substr(-6)}</div>
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
