import React, { useEffect, useState, createContext, ReactElement } from "react";
import { ethers } from "ethers";
import { TAccount } from "@types";
import { toast } from "react-toastify";
import { METAMASK_LINK } from "@constants";

const { ethereum } = window;

export const AccountContext = createContext<TAccount>({
  account: "",
  balance: "",
});

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");

  const checkMetaMask = async () => {
    if (!ethereum) {
      toast("Please install MetaMask");
    } else {
      getAccount();
    }
  };

  const initEvents = async () => {
    ethereum?.on("accountsChanged", function (accounts: string[]) {
      setAccount(accounts[0]);
      getBalance();
    });
  };

  const getAccount = async () => {
    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      toast("error", { type: "error" });
    }
  };

  const requestAccounts = async () => {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length) {
        setAccount(accounts[0]);
        getBalance();
      }
    } catch (error) {
      window.open(METAMASK_LINK);
    }
  };

  const getBalance = async () => {
    const balance = await ethereum.request({
      method: "eth_getBalance",
      params: [account],
    });
    setBalance(ethers.utils.formatEther(balance));
  };

  useEffect(() => {
    initEvents();
    account && getBalance();
  }, [account]);

  useEffect(() => {
    checkMetaMask();
  }, [ethereum?.isConnected()]);

  return (
    <AccountContext.Provider value={{ account, balance, requestAccounts }}>
      {children}
    </AccountContext.Provider>
  );
};
