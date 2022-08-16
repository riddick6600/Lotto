import React, { useEffect, useState, useContext } from "react";
import { Contract, ethers } from "ethers";
import { ticketAbi } from "../abi";
import { getSigner } from "../utils/getProvider";

const { ethereum } = window;

export const TicketContext = React.createContext();

export const TicketProvider = ({ children, address }) => {
  const [players, setPlayers] = useState([]);
  const [limit, setLimit] = useState(0);
  const [balance, setBalance] = useState("");
  const [price, setPrice] = useState("");
  const [owner, setOwner] = useState("");
  const [winner, setWinner] = useState("");
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
    console.log("owner", owner);
    setOwner(owner);
  };

  const getWinner = async () => {
    const winner = await contract.getWinner();
    if (winner !== "0x0000000000000000000000000000000000000000") {
      setWinner(winner);
    }
  };

  const withdrow = async () => {
    await contract.withdrow({ gasLimit: 30_000_000 });
  };

  const sendRegister = async () => {
    try {
      const tx = await contract.register({
        value: ethers.utils.parseEther(price),
        gasLimit: 30_000_000,
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
        withdrow,
        owner,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};
