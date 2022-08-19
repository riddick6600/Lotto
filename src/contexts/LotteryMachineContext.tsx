import React, { useEffect, useState } from "react";
import { ethers, ContractFactory, Contract } from "ethers";
import { lotteryMachineAbi, lotteryMachineBytecode } from "../abi";
import { getSigner } from "@utils";
import { toast } from "react-toastify";
import { GAS_LIMIT } from "@constants";

type TLotteryMachineContext = {
  contract?: Contract;
  balance: string;
  tickets: any[];
  createTicket?: () => {};
  deployMachine?: () => {};
  owner: string;
};

export const LotteryMachineContext =
  React.createContext<TLotteryMachineContext>({
    balance: "",
    tickets: [],
    owner: "",
  });

const LOCAL_STORAGE_LOTTERYMACHINE_CONTRACT_ADDRESS =
  "Lotto.LotteryMachine.contract.address";

export const LotteryMachineProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [balance, setBalance] = useState("");
  const [owner, setOwner] = useState("");
  const [contract, setContract] = useState<Contract>();

  const initContractFromLocalStorage = async () => {
    const address = localStorage.getItem(
      LOCAL_STORAGE_LOTTERYMACHINE_CONTRACT_ADDRESS
    );

    if (address) {
      const contract = new ethers.Contract(
        address,
        lotteryMachineAbi,
        getSigner()
      );
      setContract(contract);
    }
  };

  const getContract = async () => {
    return contract;
  };

  const deployMachine = async () => {
    try {
      const factory = new ContractFactory(
        lotteryMachineAbi,
        lotteryMachineBytecode,
        getSigner()
      );
      const contract = await factory.deploy({ gasLimit: GAS_LIMIT });
      setContract(contract);
      localStorage.setItem(
        LOCAL_STORAGE_LOTTERYMACHINE_CONTRACT_ADDRESS,
        contract.address
      );
    } catch (error) {
      toast(`Error ${error.message}`, { type: "error" });
    }
  };

  const getBalance = async () => {
    try {
      const balance = await contract.getBalance();
      const formatBalance = ethers.utils.formatEther(balance);
      setBalance(formatBalance);
    } catch (error) {
      console.error("ERROROORO", error.code);
      if (error.code === "CALL_EXCEPTION") {
        if (confirm("Стереть ID контракта Машины из LocalStorage")) {
          localStorage.removeItem(
            LOCAL_STORAGE_LOTTERYMACHINE_CONTRACT_ADDRESS
          );
          setContract(undefined);
        }
      }
    }
  };

  const getTickets = async () => {
    const tickets = await contract.getTickets();
    setTickets(tickets);
  };

  const getOwner = async () => {
    const owner = await contract.getOwner();
    setOwner(owner);
  };

  const createTicket = async (price: string, limmit: string) => {
    try {
      const tx = await contract.createTicket(
        ethers.utils.parseEther(price),
        parseInt(limmit)
      );
      await tx.wait();
      getAllData();
    } catch (error) {
      console.error("Error", error);
      alert(error.data.message);
    }
  };

  const getAllData = () => {
    getBalance();
    getTickets();
    getOwner();
  };

  useEffect(() => {
    !contract && initContractFromLocalStorage();
    contract && getAllData();
  }, [contract]);

  return (
    <LotteryMachineContext.Provider
      value={{
        contract,
        balance,
        tickets,
        createTicket,
        deployMachine,
        owner,
      }}
    >
      {children}
    </LotteryMachineContext.Provider>
  );
};
