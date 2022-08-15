import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { ticketAbi } from "../abi";

const { ethereum } = window;

export const TicketContext = React.createContext();

export const TicketProvider = ({ children, contract }) => {
  const getProvider = () => new ethers.providers.Web3Provider(ethereum);
  const createTicketContract = () =>
    new ethers.Contract(contract, ticketAbi, getProvider().getSigner());
  const ticketContract = createTicketContract();

  const [players, setPlayers] = useState([]);
  const [playersLength, setPlayersLength] = useState(0);
  const [balance, setBalance] = useState("");
  const [price, setPrice] = useState("");
  const [winner, setWinner] = useState("");

  const getBalance = async () => {
    const ethBalance = await ethereum.request({
      method: "eth_getBalance",
      params: [contract],
    });
    const formatBalance = ethers.utils.formatEther(ethBalance);
    setBalance(formatBalance);
  };

  const getPrice = async () => {
    const price = await ticketContract.getPrice();
    setPrice(ethers.utils.formatEther(price));
  };

  const getPlayers = async () => {
    const getPlayersData = await ticketContract.getPlayers();
    setPlayers(getPlayersData);
  };

  const getLimit = async () => {
    const length = await ticketContract.getLimit();
    setPlayersLength(length.toNumber());
  };

  const getWinner = async () => {
    const winner = await ticketContract.getWinner();
    if (winner !== "0x0000000000000000000000000000000000000000") {
      setWinner(winner);
    }
  };

  const sendRegister = async () => {
    try {
      const tx = await ticketContract.register({
        value: ethers.utils.parseEther(price),
        gasLimit: 10_000_000,
      });
      const res = await tx.wait();
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
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <TicketContext.Provider
      value={{
        contract,
        balance,
        price,
        players,
        sendRegister,
        winner,
        playersLength,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};
