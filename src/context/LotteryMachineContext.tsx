import React, { useEffect, useState, useContext } from "react";
import { ethers, ContractFactory, Contract } from "ethers";
import { lotteryMachineAbi, lotteryMachineBytecode } from "../abi";
import { getSigner } from "../utils/getProvider";

const { ethereum } = window;

export const LotteryMachineContext = React.createContext();

export const LotteryMachineProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [balance, setBalance] = useState("");
  const [owner, setOwner] = useState("");
  const [contract, setContract] = useState<Contract>();

  const initContract = async () => {
    const address = localStorage.getItem(
      "Lotto.LotteryMachine.contract.address"
    );

    if (address) {
      const contract = new ethers.Contract(
        address,
        lotteryMachineAbi,
        getSigner()
      );
      setContract(contract);
      // getAllData();
    }
  };

  const deployMachine = async (value) => {
    const factory = new ContractFactory(
      lotteryMachineAbi,
      lotteryMachineBytecode,
      getSigner()
    );
    const contract = await factory.deploy({
      value: ethers.utils.parseEther(value),
    });
    setContract(contract);
    localStorage.setItem(
      "Lotto.LotteryMachine.contract.address",
      contract.address
    );
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

  const withdrow = async () => {
    const tx = await contract.withdrow({ gasLimit: 1_000_000 });

    const data = await tx.wait();
    getAllData();
  };

  const createTicket = async (price: string, limmit: string, value: string) => {
    try {
      const tx = await contract.createTicket(
        ethers.utils.parseEther(price),
        parseInt(limmit),
        { value: ethers.utils.parseEther(value) }
      );
      await tx.wait();
    } catch (error) {
      console.error("Error", error);
      alert(error.data.message);
    }
    getAllData();
  };

  const getAllData = () => {
    getBalance();
    getTickets();
    getOwner();
  };

  useEffect(() => {
    initContract();
  }, []);

  useEffect(() => {
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
        withdrow,
        owner,
      }}
    >
      {children}
    </LotteryMachineContext.Provider>
  );
};
