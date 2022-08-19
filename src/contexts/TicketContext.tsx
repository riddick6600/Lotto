import React, { useEffect, useState, useContext } from "react";
import { BigNumber, Contract, ethers } from "ethers";
import { ticketAbi } from "@abi";
import { getProvider, getSigner } from "@utils";
import { GAS_LIMIT } from "@constants";

type TWinner = {
  winner: string;
  difficulty: BigNumber;
  timestamp: BigNumber;
  number: BigNumber;
};

export const TicketContext = React.createContext();

export const TicketProvider = ({ children, address }) => {
  const [players, setPlayers] = useState([]);
  const [limit, setLimit] = useState(0);
  const [balance, setBalance] = useState("");
  const [price, setPrice] = useState("");
  const [owner, setOwner] = useState("");
  const [winner, setWinner] = useState<TWinner>();
  const [contract, setContract] = useState<Contract>();

  const initContract = async () => {
    if (address) {
      const contract = new ethers.Contract(address, ticketAbi, getSigner());
      setContract(contract);
    }
  };

  const getBalance = async () => {
    const ethBalance = await contract.getBalance();
    const formatBalance = ethers.utils.formatEther(ethBalance);
    setBalance(formatBalance);
  };

  const getPrice = async () => {
    const price = await contract.getPrice();
    setPrice(ethers.utils.formatEther(price));
  };

  const getPlayers = async () => {
    const getPlayersData = await contract.getPlayers();
    setPlayers(getPlayersData);
  };

  const getLimit = async () => {
    const length = await contract.getLimit();
    setLimit(length.toNumber());
  };

  const getOwner = async () => {
    const owner = await contract.getOwner();
    setOwner(owner);
  };

  const getWinner = async () => {
    const winner: TWinner = await contract.getWinner();
    if (winner.winner !== "0x0000000000000000000000000000000000000000") {
      const block = await getProvider().getBlock(winner.number.toNumber());
      setWinner(winner);
    }
  };

  const sendRegister = async () => {
    try {
      const tx = await contract.register({
        value: ethers.utils.parseEther(price),
        gasLimit: GAS_LIMIT,
      });
      const res = await tx.wait();
      getAllData();
    } catch (error) {
      console.error("Error", error);
      alert(error.data.message);
    }
    getAllData();
  };

  const getAllData = () => {
    getPrice();
    getBalance();
    getPlayers();
    getWinner();
    getLimit();
    getOwner();
  };

  useEffect(() => {
    !contract && initContract();
    contract && getAllData();
  }, [contract]);

  return (
    <TicketContext.Provider
      value={{
        address,
        contract,
        balance,
        price,
        players,
        sendRegister,
        winner,
        limit,
        owner,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};
