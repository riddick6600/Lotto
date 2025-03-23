/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 31337
    },
  },
  paths: {
    artifacts: "./src/artifacts",
  },
  // For testing
  mocha: {
    timeout: 40000,
  },
};