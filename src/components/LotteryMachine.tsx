import React, { useContext, useState } from "react";
import { Lottery } from "@components";
import { LotteryMachineContext } from "@contexts";
import { getHash } from "@utils";

export const LotteryMachine = () => {
  const { contract, balance, createTicket, owner } = useContext(
    LotteryMachineContext
  );

  const [form, setForm] = useState({
    price: "",
    limit: "",
  });

  const handleClick = () => {
    createTicket(form.price, form.limit);
  };

  const handleChange = ({ target }) => {
    setForm((prev) => {
      return { ...prev, [target.name]: target.value };
    });
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
            <input
              placeholder="Price ETH"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
            />
            <input
              placeholder="Limit players"
              type="number"
              name="limit"
              value={form.limit}
              onChange={handleChange}
            />
            <button onClick={handleClick}>Create ticket</button>
          </div>
        </>
      )}
      <hr />
      <Lottery />
    </div>
  );
};
