import './App.css'
import { Container, Header, Title } from '@mantine/core';
import { WalletInstallation } from './component/organisms/Wallet/Installation';

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
