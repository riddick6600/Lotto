import { GAS_LIMIT } from "@constants";
import { getSigner } from "@utils";
import { Contract, ContractFactory, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { casinoAbi, casinoBytecode } from "../abi";

type TCasinoContext = {
  contract?: Contract;
  balance: string;
  machines: any[];
  createMachine?: () => {};
  deployCasino?: () => {};
  owner: string;
};

export const CasinoContext = React.createContext<TCasinoContext>({
  balance: "",
  machines: [],
  owner: "",
});

const LOCAL_STORAGE_CASINO_CONTRACT_ADDRESS = "Lotto.Casino.contract.address";

export const CasinoProvider = ({ children }) => {
  const [machines, setMachines] = useState([]);
  const [balance, setBalance] = useState("");
  const [owner, setOwner] = useState("");
  const [contract, setContract] = useState<Contract>();

  const initContractFromLocalStorage = async () => {
    const address = localStorage.getItem(LOCAL_STORAGE_CASINO_CONTRACT_ADDRESS);
    console.log('[CasinoContext] initContractFromLocalStorage, address:', address);
    if (address) {
      const contract = new ethers.Contract(address, casinoAbi, getSigner());
      setContract(contract);
    }
  };

  const deployCasino = async () => {
    try {
      console.log('[CasinoContext] deployCasino called');
      const factory = new ContractFactory(
        casinoAbi,
        casinoBytecode,
        getSigner()
      );
      const contract = await factory.deploy({ gasLimit: GAS_LIMIT });
      console.log('[CasinoContext] Casino deployed, address:', contract.address);
      setContract(contract);
      localStorage.setItem(
        LOCAL_STORAGE_CASINO_CONTRACT_ADDRESS,
        contract.address
      );
    } catch (error) {
      toast(`Error ${error.message}`, { type: "error" });
      console.error('[CasinoContext] deployCasino error:', error);
    }
  };

  const getBalance = async () => {
    try {
      const balance = await contract.getBalance();
      const formatBalance = ethers.utils.formatEther(balance);
      setBalance(formatBalance);
    } catch (error: any) {
      if (error.code === "CALL_EXCEPTION") {
        if (confirm("Стереть ID контракта Машины из LocalStorage")) {
          localStorage.removeItem(LOCAL_STORAGE_CASINO_CONTRACT_ADDRESS);
          setContract(undefined);
        }
      }
    }
  };

  const getMachines = async () => {
    const machines = await contract.getMachines();
    setMachines(machines);
  };

  const getOwner = async () => {
    const owner = await contract.getOwner();
    setOwner(owner);
  };

  const createMachine = async () => {
    try {
      const tx = await contract.createMachine();
      await tx.wait();
      getAllData();
    } catch (error) {
      toast(error.data.message, { type: "error" });
    }
  };

  const getAllData = () => {
    getBalance();
    getMachines();
    getOwner();
  };

  useEffect(() => {
    console.log('[CasinoContext] useEffect, contract:', contract);
    !contract && initContractFromLocalStorage();
    contract && getAllData();
  }, [contract]);

  return (
    <CasinoContext.Provider
      value={{
        contract,
        balance,
        machines,
        owner,
        deployCasino,
        createMachine,
      }}
    >
      {children}
    </CasinoContext.Provider>
  );
};
