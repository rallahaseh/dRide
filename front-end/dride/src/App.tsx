import './App.css'
import { Container, Header, Title } from '@mantine/core';
import { WalletInstallation } from './component/organisms/Wallet/Installation';
import { WalletConnect } from './component/organisms/Wallet/Connect';

function App() {
  const { ethereum } = window as any;
  return (
    <div className="App">
      <Header
        height={60}
        px="xl"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
        <Title>dRide</Title>
        <WalletConnect />
      </Header>
      {!ethereum ? (
        <Container p="lg">
          <WalletInstallation />
        </Container>
      ) : null}
    </div>
  )
}

export default App
