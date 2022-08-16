declare global {
  interface Window {
    ethereum: any;
  }
}

import React, { useEffect, useState, useContext } from "react";
import { ethers, ContractFactory, Contract } from "ethers";
import { storageAbi, storageBytecode } from "../abi";
import { AccountContext } from "./AccountContext";
import { getSigner } from "../utils/getProvider";

const { ethereum } = window;

export const StorageContext = React.createContext();

export const StorageProvider = ({ children }) => {
  const { account } = useContext(AccountContext);
  const [contract, setContract] = useState<Contract>();
  const [data, setData] = useState("");

  const getData = async () => {
    try {
      const data = await contract.getData();
      setData(data);
    } catch (error) {
      console.error("ERROROORO", error.code);
      if (error.code === "CALL_EXCEPTION") {
        if (confirm("Стереть ID контракта из LocalStorage")) {
          localStorage.removeItem("Lotto.Storage.contract.address");
          setContract(null);
        }
      }
    }
  };

  const sendData = async (data) => {
    const tx = await contract.setData(data);
    await tx.wait();
    getData();
  };

  const initContract = async () => {
    const address = localStorage.getItem("Lotto.Storage.contract.address");

    if (address) {
      const contract = new ethers.Contract(address, storageAbi, getSigner());
      setContract(contract);
    }
  };

  const deployContract = async () => {
    const factory = new ContractFactory(
      storageAbi,
      storageBytecode,
      getSigner()
    );
    const contract = await factory.deploy();
    setContract(contract);
    localStorage.setItem("Lotto.Storage.contract.address", contract.address);
  };

  useEffect(() => {
    contract && getData();
  }, [contract]);

  useEffect(() => {
    initContract();
  }, [account]);

  return (
    <StorageContext.Provider
      value={{ data, contract, sendData, deployContract }}
    >
      {children}
    </StorageContext.Provider>
  );
};
