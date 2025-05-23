import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'Be The Nation',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string, // required
    chains: [baseSepolia], 
});