import React, { useContext } from "react";
import { AccountContext } from "../context/AccountContext";
const { ethereum } = window;

export const Wallet = () => {
  const { account, balance } = useContext(AccountContext);

  return (
    <div>
      <div>Account: {account}</div>
      <div>Balance: {balance}</div>
      <br />
      <div>ChainId: {ethereum?.chainId}</div>
      <div>NetworkVersion: {ethereum?.networkVersion}</div>
    </div>
  );
};
