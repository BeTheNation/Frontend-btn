import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;

if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined");
}

if (!alchemyKey) {
  throw new Error("NEXT_PUBLIC_ALCHEMY_API_KEY is not defined");
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [alchemyProvider({ apiKey: alchemyKey }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Country GDP Prediction Market",
  projectId,
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };
