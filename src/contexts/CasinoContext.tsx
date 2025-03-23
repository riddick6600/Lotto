import React, { useEffect, useState, useContext } from "react";
import { ethers, Contract, ContractFactory } from "ethers";
import { casinoAbi, casinoBytecode } from "../abi";
import { getSigner } from "@utils";
import { toast } from "react-toastify";
import { GAS_LIMIT, VRF_CONFIG } from "@constants";
import { AccountContext } from "./AccountContext";

type TCasinoContext = {
  contract?: Contract;
  balance: string;
  machines: any[];
  createMachine?: () => Promise<void>;
  deployCasino?: () => Promise<void>;
  owner: string;
  getPlayerTickets?: (address: string) => Promise<string[][]>;
  isLoading: boolean;
};

export const CasinoContext = React.createContext<TCasinoContext>({
  balance: "",
  machines: [],
  owner: "",
  isLoading: false,
});

const LOCAL_STORAGE_CASINO_CONTRACT_ADDRESS = "Lotto.Casino.contract.address";

export const CasinoProvider = ({ children }) => {
  const { account } = useContext(AccountContext);
  const [machines, setMachines] = useState<string[]>([]);
  const [balance, setBalance] = useState("");
  const [owner, setOwner] = useState("");
  const [contract, setContract] = useState<Contract>();
  const [isLoading, setIsLoading] = useState(false);

  const initContractFromLocalStorage = async () => {
    const address = localStorage.getItem(LOCAL_STORAGE_CASINO_CONTRACT_ADDRESS);

    if (address) {
      try {
        const signer = await getSigner();
        const contract = new ethers.Contract(address, casinoAbi, signer);
        
        // Check if the contract exists on the blockchain
        const provider = await signer.provider;
        const code = await provider.getCode(address);
        if (code === "0x") {
          toast("Casino contract not found on this network. Deploying a new one.", { type: "info" });
          localStorage.removeItem(LOCAL_STORAGE_CASINO_CONTRACT_ADDRESS);
          return;
        }
        
        setContract(contract);
      } catch (error) {
        console.error("Error initializing contract:", error);
        toast("Error initializing contract. Deploying a new one.", { type: "error" });
        localStorage.removeItem(LOCAL_STORAGE_CASINO_CONTRACT_ADDRESS);
      }
    }
  };

  const deployCasino = async () => {
    try {
      setIsLoading(true);
      toast("Deploying Casino contract...", { type: "info" });
      
      const signer = await getSigner();
      const factory = new ContractFactory(
        casinoAbi,
        casinoBytecode,
        signer
      );
      
      // Deploy with Chainlink VRF configuration
      const deployedContract = await factory.deploy(
        VRF_CONFIG.VRF_COORDINATOR,
        VRF_CONFIG.LINK_TOKEN,
        VRF_CONFIG.KEY_HASH,
        VRF_CONFIG.FEE,
        { gasLimit: BigInt(GAS_LIMIT) }
      );
      
      // Wait for the contract to be deployed
      await deployedContract.waitForDeployment();
      const contractAddress = await deployedContract.getAddress();
      
      setContract(deployedContract);
      localStorage.setItem(
        LOCAL_STORAGE_CASINO_CONTRACT_ADDRESS,
        contractAddress
      );
      
      toast("Casino deployed successfully!", { type: "success" });
    } catch (error: any) {
      console.error("Error deploying casino:", error);
      toast(`Error: ${error.message}`, { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const getBalance = async () => {
    try {
      const balance = await contract.getBalance();
      const formatBalance = ethers.formatEther(balance);
      setBalance(formatBalance);
    } catch (error: any) {
      console.error("Error getting balance:", error);
      
      if (error.code === "CALL_EXCEPTION") {
        if (confirm("Contract not found on this network. Remove from local storage?")) {
          localStorage.removeItem(LOCAL_STORAGE_CASINO_CONTRACT_ADDRESS);
          setContract(undefined);
        }
      }
    }
  };

  const getMachines = async () => {
    try {
      const machines = await contract.getMachines();
      setMachines(machines);
    } catch (error) {
      console.error("Error getting machines:", error);
    }
  };

  const getOwner = async () => {
    try {
      // Check if contract is using the new or old version
      if (contract.owner) {
        const owner = await contract.owner();
        setOwner(owner);
      } else {
        const owner = await contract.getOwner();
        setOwner(owner);
      }
    } catch (error) {
      console.error("Error getting owner:", error);
    }
  };

  const createMachine = async () => {
    try {
      setIsLoading(true);
      toast("Creating new lottery machine...", { type: "info" });
      
      const tx = await contract.createMachine();
      await tx.wait();
      
      toast("Lottery machine created successfully!", { type: "success" });
      getAllData();
    } catch (error: any) {
      console.error("Error creating machine:", error);
      toast(error.data?.message || error.message, { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPlayerTickets = async (address: string): Promise<string[][]> => {
    try {
      // Check if contract supports the new method
      if (contract.getPlayerTickets) {
        return await contract.getPlayerTickets(address);
      } else {
        // Fallback for older contract versions
        return [];
      }
    } catch (error) {
      console.error("Error getting player tickets:", error);
      return [];
    }
  };

  const getAllData = () => {
    if (!contract) return;
    
    getBalance();
    getMachines();
    getOwner();
  };

  useEffect(() => {
    if (!account) return;
    
    !contract && initContractFromLocalStorage();
    contract && getAllData();
  }, [contract, account]);

  return (
    <CasinoContext.Provider
      value={{
        contract,
        balance,
        machines,
        owner,
        deployCasino,
        createMachine,
        getPlayerTickets,
        isLoading,
      }}
    >
      {children}
    </CasinoContext.Provider>
  );
};