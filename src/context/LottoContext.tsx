import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { lottoAbi } from "../abi";

const { ethereum } = window;

export const LottoContext = React.createContext();

export const LottoProvider = ({ children, contract }) => {
  const getProvider = () => new ethers.providers.Web3Provider(ethereum);
  const createLottoContract = () =>
    new ethers.Contract(contract, lottoAbi, getProvider().getSigner());
  const lottoContract = createLottoContract();

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
    const price = await lottoContract.getPrice();
    setPrice(ethers.utils.formatEther(price));
  };

  const getPlayers = async () => {
    const getPlayersData = await lottoContract.getPlayers();
    setPlayers(getPlayersData);
  };

  const getPlayerLength = async () => {
    const length = await lottoContract.getPlayersLength();
    setPlayersLength(length.toNumber());
  };

  const getWinner = async () => {
    const winner = await lottoContract.getWinner();
    if (winner !== "0x0000000000000000000000000000000000000000") {
      setWinner(winner);
    }
  };

  const sendRegister = async () => {
    try {
      const tx = await lottoContract.register({
        value: ethers.utils.parseEther(price),
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
    getPlayerLength();
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <LottoContext.Provider
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
    </LottoContext.Provider>
  );
};
