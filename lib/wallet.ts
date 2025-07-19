import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bscTestnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Be The Nation",
  projectId: "YOUR_PROJECT_ID",
  chains: [bscTestnet],
});
