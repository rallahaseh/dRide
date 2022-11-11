import { FC, Fragment, ReactNode } from 'react';
// RainbowKit
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
    [chain.goerli, chain.mainnet],
    [
      infuraProvider({ apiKey: process.env.INFURA_ID }),
      publicProvider()
    ]
  );
  
  const { connectors } = getDefaultWallets({
    appName: 'dRide | Decentralized Ride',
    chains
  });
  
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  });

export const Web3Provider: FC<Web3ProviderProps> = (props: Web3ProviderProps) => {
  const { children } = props;

  return (
    <Fragment>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={lightTheme()} appInfo={{ appName: 'dRide' }}>
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </Fragment>
  );
};

interface Web3ProviderProps {
  children?: ReactNode;
}