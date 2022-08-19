import React, { useEffect, useState, createContext, ReactElement } from "react";
import { ethers } from "ethers";
import { TAccouunt } from "@types";
import { toast } from "react-toastify";
import { METAMASK_LINK } from "@constants";

const { ethereum } = window;

export const AccountContext = createContext<TAccouunt | null>(null);

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");

  const checkMetaMask = async () => {
    if (!ethereum) {
      toast("Please install MetaMask");
    }
  };

  const initEvents = async () => {
    ethereum?.on("accountsChanged", function (accounts: string[]) {
      setAccount(accounts[0]);
    });
  };

  const getAccount = async () => {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      setAccount(accounts[0]);
    }
  };

  const requestAccounts = async () => {
    console.log("requestAccounts", requestAccounts);
    try {
      await ethereum.request({
        method: "eth_requestAccounts",
      });
    } catch (error) {
      window.open(METAMASK_LINK);
    }
  };

  const getBalance = async () => {
    console.log("getBalance", account);
    const ethBalance = await ethereum.request({
      method: "eth_getBalance",
      params: [account],
    });
    console.log("ethBalance", ethBalance);
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
    <AccountContext.Provider value={{ account, balance, requestAccounts }}>
      {children}
    </AccountContext.Provider>
  );
};
