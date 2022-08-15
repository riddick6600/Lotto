import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { lotteryMachineAbi } from "../abi";
import { getSigner } from "../utils/getProvider";

const { ethereum } = window;

export const LotteryMachineContext = React.createContext();

const contract = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const LotteryMachineProvider = ({ children }) => {
  const createTicketContract = () =>
    new ethers.Contract(contract, lotteryMachineAbi, getSigner());

  const LotteryMachineContract = createTicketContract();

  const [tickets, setTickets] = useState([]);
  const [balance, setBalance] = useState("");

  const getBalance = async () => {
    const ethBalance = await ethereum.request({
      method: "eth_getBalance",
      params: [contract],
    });
    const formatBalance = ethers.utils.formatEther(ethBalance);
    setBalance(formatBalance);
  };

  const getTickets = async () => {
    const tickets = await LotteryMachineContract.getTickets();
    setTickets(tickets);
  };

  const createTicket = async (price: string, limmit: string) => {
    try {
      const tx = await LotteryMachineContract.createTicket(
        ethers.utils.parseEther(price),
        parseInt(limmit)
      );
      console.log("tx", tx);
      const res = await tx.wait();
      console.log("res", res);
    } catch (error) {
      console.error("Error", error);
      alert(error.data.message);
    }
    getAllData();
  };

  const getAllData = () => {
    getBalance();
    getTickets();
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <LotteryMachineContext.Provider
      value={{
        contract,
        balance,
        tickets,
        createTicket,
      }}
    >
      {children}
    </LotteryMachineContext.Provider>
  );
};
