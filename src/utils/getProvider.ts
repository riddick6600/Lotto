import { ethers } from "ethers";

const { ethereum } = window;

export const getProvider = () => new ethers.providers.Web3Provider(ethereum);

export const getSigner = () => getProvider().getSigner();
