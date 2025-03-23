import { ethers } from "ethers";

const { ethereum } = window;

export const getProvider = () => new ethers.BrowserProvider(ethereum);

export const getSigner = async () => await getProvider().getSigner();