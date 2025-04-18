# BeTheNation

A decentralized platform for trading and predicting country GDP performance using blockchain technology.

## Overview

BeTheNation is a crypto-based trading platform allowing users to take long or short positions on different countries' economic performance. The platform features leverage trading, a demo mode for risk-free practice, real-time charts, and comprehensive position management.

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Blockchain Integration**: Ethereum, Wagmi, Ethers.js
- **Smart Contracts**: Solidity
- **Development Tools**: Hardhat

## Features

- Crypto-based trading with margin and leverage
- Long/short positions on country GDP performance
- Demo mode for practice trading
- Real-time price charts and market data
- Position management with stop-loss and take-profit
- Wallet integration with multiple providers

## Prerequisites

- Node.js (v18+)
- npm or yarn
- MetaMask or another Ethereum wallet
- Alchemy API key
- WalletConnect Project ID (for wallet integration)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/BeTheNation/Frontend.git
   cd Frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory using the template below:

   ```
   # Network URLs
   SEPOLIA_RPC_URL=https://eth-sepolia.example.com/your-api-key

   # Account private keys (without 0x prefix)
   PRIVATE_KEY=your_private_key_here_without_0x_prefix

   # Frontend environment variables
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key_here

   # Optional: Etherscan API Key for contract verification
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   ```

## Smart Contract Deployment

If you need to deploy the smart contract:

1. Compile the contract:

   ```
   npx hardhat compile
   ```

2. Deploy to Sepolia testnet:

   ```
   npx hardhat run scripts/deploy.ts --network sepolia
   ```

3. Update contract address in your configuration if needed.

## Development

Start the development server:

```
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Demo Mode

The platform features a Demo Mode that allows you to practice trading without connecting a real wallet. Toggle Demo Mode in the application interface to explore the platform's features without risking actual funds.

## Testing

Run tests with:

```
npm run test
```

## Build and Deployment

Create a production build:

```
npm run build
```

Run the production build locally:

```
npm start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
