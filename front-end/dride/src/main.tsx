import { Config, DAppProvider, Goerli } from '@usedapp/core'
import { getDefaultProvider } from 'ethers'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const configuration: Config = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: getDefaultProvider('goerli', { alchemy: import.meta.env.ALCHEMY_PROJECT_API_KEY }),
  },
  multicallVersion: 2,
  networks: [Goerli],
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DAppProvider config={configuration}>
      <App />
    </DAppProvider>
  </React.StrictMode>
)
