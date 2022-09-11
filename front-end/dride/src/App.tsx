import './App.css'
import { AppShell, useMantineTheme, Container } from '@mantine/core';
import { WalletInstallation } from './component/organisms/Wallet/Installation';
import { Dashboard } from './component/organisms/Dashboard/Dashboard';
import { Goerli, useEtherBalance, useEthers } from '@usedapp/core';
import { SplashScreen } from './component/organisms/SplashScreen';
import { useState } from 'react';
import { AppHeader } from './component/main/AppHeader';
import { AppFooter } from './component/main/AppFooter';
import { NavigationBar } from './component/main';
import { formatEther } from '@ethersproject/units';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import { AddVehicle } from './component/organisms/Vehicle';

function App() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { ethereum } = window as any;
  const { account, chainId } = useEthers();

  const isConnectedToWallet = (account?.length != null && chainId === Goerli.chainId);
  const etherBalance = useEtherBalance(account);
  const walletData = { address: account ?? "", balance: formatEther(etherBalance ?? 0) }

  return (
    <div className="App">
      <Router>
        <AppShell
          styles={{
            main: {
              background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
            },
          }}
          navbarOffsetBreakpoint="sm"
          asideOffsetBreakpoint="sm"
          // Navigation Bar
          navbar={
            <NavigationBar
              opened={opened}
              isAdmin={true}
              isConnectedToWallet={isConnectedToWallet}
              walletData={walletData}
            />
          }
          // Footer
          footer={
            <AppFooter />
          }
          // Header
          header={
            <AppHeader setOpened={setOpened} opened={opened} />
          }
        >
          {/* Content */}
          <Routes>
            <Route path='/' element={
              <Container>
                {/* Check whether we do have a wallet extension installed within the browser. */}
                {!ethereum ? (
                  <Container p="lg">
                    <WalletInstallation />
                  </Container>
                ) : (
                  /* Check whether there is an account connected to the network or not. */
                  isConnectedToWallet ? <Dashboard /> : <SplashScreen />
                )}
              </Container>
            } />
            <Route path='/add-car' element={<AddVehicle />} />
          </Routes>
        </AppShell>
      </Router>
    </div>
  )
}

export default App