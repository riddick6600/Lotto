export const GAS_LIMIT = 10_000_000;
export const METAMASK_LINK = "https://metamask.io";

// Chainlink VRF Configuration - Hardhat Local Node
export const VRF_CONFIG = {
  // On local hardhat node, we'll use mock addresses
  // In a real environment, these would be the actual Chainlink VRF addresses
  VRF_COORDINATOR: "0x0000000000000000000000000000000000000001",
  LINK_TOKEN: "0x0000000000000000000000000000000000000002",
  KEY_HASH: "0x0000000000000000000000000000000000000000000000000000000000000000",
  FEE: "100000000000000000" // 0.1 LINK
};

// Ethereum network configuration
export const NETWORKS = {
  hardhat: {
    chainId: "0x7A69", // 31337
    name: "Hardhat Local",
    color: "#B8860B"
  },
  mainnet: {
    chainId: "0x1", // 1
    name: "Ethereum Mainnet",
    color: "#29B6AF"
  },
  goerli: {
    chainId: "0x5", // 5
    name: "Goerli Testnet",
    color: "#3099f2"
  },
  sepolia: {
    chainId: "0xaa36a7", // 11155111
    name: "Sepolia Testnet",
    color: "#9064ff"
  }
};
