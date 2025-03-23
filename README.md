# Lotto - Ethereum Lottery dApp

Lotto is a decentralized application for running lotteries on the Ethereum blockchain. Players can buy tickets as NFTs and win ETH when a random winner is selected.

![Lotto App](./screenshot-connected.png)

## Features

- Create and manage lottery casinos
- Deploy lottery machines within casinos
- Create tickets with different prices and player limits
- Purchase tickets as NFTs (ERC-721 tokens)
- Transfer tickets to other users
- Automatic winner selection with Chainlink VRF
- View all your tickets in the "My Tickets" section

## Prerequisites

- Node.js 18.6.0 or higher
- MetaMask browser extension

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/lotto.git
   cd lotto
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install Playwright for tests (optional):
   ```
   npx playwright install
   ```

## Running the Application

1. Start the local Hardhat blockchain node:
   ```
   npm run hardhat
   ```

2. In a separate terminal, start the development server:
   ```
   npm run dev
   ```

3. Or run both simultaneously:
   ```
   npm run start
   ```

4. Open your browser and navigate to http://localhost:5173

## Testing

Run the Playwright tests:
```
npm run test
```

Generate screenshots:
```
npm run screenshot
```

## Building for Production

1. Build the application:
   ```
   npm run build
   ```

2. Preview the production build:
   ```
   npm run serve
   ```

## Smart Contracts

### Casino.sol
The main contract that manages lottery machines and handles commissions.

### LotteryMachine.sol
Creates and manages tickets within a casino.

### Ticket.sol
Implements the ERC-721 standard for NFT lottery tickets. Handles player registration, random winner selection using Chainlink VRF, and prize distribution.

## Development Notes

- Contracts use Solidity 0.8.9
- Frontend is built with React, TypeScript, and Vite
- Ethers.js is used for blockchain interaction
- OpenZeppelin contracts are used for ERC-721 and security
- Chainlink VRF is used for secure randomness

## License

This project is licensed under the Unlicense - see the LICENSE file for details.

## Acknowledgments

- OpenZeppelin for security contracts
- Chainlink for VRF
- Hardhat and Ethers.js teams