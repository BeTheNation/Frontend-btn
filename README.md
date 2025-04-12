# BeTheNation Frontend

A decentralized platform for trading and predicting country GDP performance, offering a unique financial market experience with advanced trading features.

## Features

- **Crypto-Based Trading Platform**: Trade on country GDP performance using cryptocurrencies
- **Leverage Trading**: Open positions with up to 50x leverage
- **Demo Mode**: Practice trading with demo funds without risking real assets
- **Real-Time Charts**: Interactive charts showing country performance and sentiment
- **Position Management**: Open, close, and track multiple positions
- **Funding Rate Mechanism**: Automatic funding rate adjustments based on market imbalances
- **Take Profit/Stop Loss**: Set automatic exit conditions for your positions
- **Wallet Integration**: Connect with popular Web3 wallets via WalletConnect

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Web3 Integration**: wagmi, WalletConnect, Rainbow Kit
- **State Management**: React Context and Zustand
- **Smart Contract Integration**: Ethereum (Sepolia testnet)
- **Charts**: Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm (recommended)
- MetaMask or any WalletConnect compatible wallet

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/BeTheNation/frontend.git
   cd frontend
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Create an `.env.local` file based on `.env.example`:
   ```
   cp .env.example .env.local
   ```

4. Add your own API keys in `.env.local`

5. Start the development server:
   ```
   pnpm dev
   ```

## Usage

- **Demo Mode**: Toggle demo mode in the header to practice trading without connecting a wallet
- **Connect Wallet**: Use the "Connect Wallet" button to connect your Web3 wallet when ready
- **Trading**: Select a country, choose a position direction (long/short), set leverage and position size
- **Position Management**: View and manage active positions in the dashboard
- **History**: Track your past trades in the trade history section

## Project Structure

- `/app`: Next.js 14 app router pages
- `/components`: React components organized by feature
- `/contexts`: React context providers
- `/hooks`: Custom React hooks
- `/lib`: Utility functions and shared code
- `/public`: Static assets
- `/services`: API and contract service implementations
- `/types`: TypeScript type definitions

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: WalletConnect project ID
- `NEXT_PUBLIC_ALCHEMY_API_KEY`: Alchemy API key for RPC connections
- `SEPOLIA_RPC_URL`: Sepolia testnet RPC URL
- `PRIVATE_KEY`: Private key for contract deployments (dev only)
- `ETHERSCAN_API_KEY`: Etherscan API key for contract verification

## License

[MIT License](LICENSE)