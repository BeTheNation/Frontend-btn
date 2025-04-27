# BeTheNation

A decentralized platform for trading and predicting country GDP performance using blockchain technology.

## Overview

BeTheNation is a crypto-based trading platform allowing users to take long or short positions on different countries' economic performance. The platform features leverage trading, a demo mode for risk-free practice, real-time charts, and comprehensive position management.

## Recent Fixes

- Fixed TypeScript error related to case sensitivity in CountryCard component imports
- Added forceConsistentCasingInFileNames to TypeScript configuration

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Blockchain Integration**: Ethereum, Wagmi, Ethers.js

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
- WalletConnect Project ID (for wallet integration)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/BeTheNation/Frontend-btn.git
   cd Frontend-btn
   ```

2. Install dependencies:

   ```
   npm install
   ```
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
