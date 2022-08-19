import React, { useEffect, useState, useContext } from "react";
import { ethers, ContractFactory, Contract } from "ethers";

import { storageAbi, storageBytecode } from "@abi";
import { getSigner } from "@utils";

export const StorageContext = React.createContext({});

const LOCAL_STORAGE_STORAGE_CONTRACT_ADDRESS = "Lotto.Storage.contract.address";

export const StorageProvider = ({ children }) => {
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
          localStorage.removeItem(LOCAL_STORAGE_STORAGE_CONTRACT_ADDRESS);
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
    const address = localStorage.getItem(
      LOCAL_STORAGE_STORAGE_CONTRACT_ADDRESS
    );

    if (address) {
      const contract = new ethers.Contract(address, storageAbi, getSigner());
      setContract(contract);
    }
  };

  const deployContract = async () => {
    console.log("deployContract");
    const factory = new ContractFactory(
      storageAbi,
      storageBytecode,
      getSigner()
    );
    const contract = await factory.deploy();
    setContract(contract);
    localStorage.setItem(
      LOCAL_STORAGE_STORAGE_CONTRACT_ADDRESS,
      contract.address
    );
  };

  useEffect(() => {
    !contract && initContract();
    contract && getData();
  }, [contract]);

  return (
    <StorageContext.Provider
      value={{ data, contract, sendData, deployContract }}
    >
      {children}
    </StorageContext.Provider>
  );
};
