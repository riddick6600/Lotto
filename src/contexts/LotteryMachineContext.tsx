import React, { useEffect, useState } from "react";
import { ethers, Contract } from "ethers";
import { lotteryMachineAbi } from "../abi";
import { getSigner } from "@utils";
import { toast } from "react-toastify";
import { GAS_LIMIT } from "@constants";

type TLotteryMachineContext = {
  contract?: Contract;
  balance: string;
  tickets: any[];
  createTicket?: (price: string, limmit: string) => {};
  owner: string;
};

export const LotteryMachineContext =
  React.createContext<TLotteryMachineContext>({
    balance: "",
    tickets: [],
    owner: "",
  });

export const LotteryMachineProvider = ({ address, children }) => {
  const [tickets, setTickets] = useState([]);
  const [balance, setBalance] = useState("");
  const [owner, setOwner] = useState("");
  const [contract, setContract] = useState<Contract>();

  const initContract = async () => {
    if (address) {
      const contract = new ethers.Contract(
        address,
        lotteryMachineAbi,
        getSigner()
      );
      setContract(contract);
    }
  };

  const getBalance = async () => {
    const balance = await contract.getBalance();
    const formatBalance = ethers.utils.formatEther(balance);
    setBalance(formatBalance);
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
      toast(error.data.message, { type: "error" });
    }
  };

  const getAllData = () => {
    getBalance();
    getTickets();
    getOwner();
  };

  useEffect(() => {
    contract && getAllData();
  }, [contract]);

  useEffect(() => {
    address && initContract();
  }, [address]);

  return (
    <LotteryMachineContext.Provider
      value={{
        address,
        contract,
        balance,
        tickets,
        createTicket,
        owner,
      }}
    >
      {children}
    </LotteryMachineContext.Provider>
  );
};
