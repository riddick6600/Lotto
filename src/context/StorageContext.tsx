declare global {
  interface Window {
    ethereum: any;
  }
}

import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { storageAbi } from "../abi";
import { AccountContext } from "./AccountContext";

const { ethereum } = window;

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const getProvider = () => new ethers.providers.Web3Provider(ethereum);

const storageContract = new ethers.Contract(
  contractAddress,
  storageAbi,
  getProvider().getSigner()
);

export const StorageContext = React.createContext();

export const StorageProvider = ({ children }) => {
  const { account } = useContext(AccountContext);
  const [data, setData] = useState("");

  const getData = async () => {
    const data = await storageContract.getData();
    setData(data);
  };

  const sendData = async (data) => {
    const tx = await storageContract.setData(data);
    await tx.wait();
    getData();
  };

  useEffect(() => {
    getData();
  }, [account]);

  return (
    <StorageContext.Provider value={{ data, sendData }}>
      {children}
    </StorageContext.Provider>
  );
};
