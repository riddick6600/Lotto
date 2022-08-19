import React, { useContext } from "react";
import { AccountContext } from "@contexts/AccountContext";

const { ethereum } = window;

export const Wallet = () => {
  const { account, balance } = useContext<TAccount>(AccountContext);

  return (
    <div>
      <div>Account: {account}</div>
      <div>Balance: {balance}</div>
      <div>https://chainlist.org/</div>
      <div>ChainId: {ethereum?.chainId}</div>
      <div>NetworkVersion: {ethereum?.networkVersion}</div>
    </div>
  );
};
