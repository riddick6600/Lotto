import React, { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
const { ethereum } = window;

export const AccountContext = React.createContext();

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");

  const checkMetaMask = async () => {
    if (!ethereum) return alert("Please install MetaMask.");
  };

  const initEvents = async () => {
    ethereum?.on("accountsChanged", function (accounts) {
      setAccount(accounts[0]);
    });
  };

  const getAccount = async () => {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      setAccount(accounts[0]);
    } else {
      requestAccounts();
    }
  };

  const requestAccounts = async () => {
    const requestAccounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
  };

  const getBalance = async () => {
    const ethBalance = await ethereum.request({
      method: "eth_getBalance",
      params: [account],
    });
    const formatBalance = ethers.utils.formatEther(ethBalance);
    setBalance(formatBalance);
    return formatBalance;
  };

  useEffect(() => {
    checkMetaMask();
    getAccount();
    initEvents();
  }, []);

  useEffect(() => {
    account && getBalance();
  }, [account]);

  return (
    <AccountContext.Provider value={{ account, balance, getAccount }}>
      {children}
    </AccountContext.Provider>
  );
};
