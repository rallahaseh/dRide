# dRide
A decentralized car-sharing system using smart contracts.

# Team members
Rashed Al-Lahaseh - 00821573

# Supervisor
Prof. Dr. [Peter Jüttner](https://www.th-deg.de/de/Peter-J%C3%BCttner-Fakult%C3%A4t%20Angewandte%20Informatik-Professor:innen-1985)

# Organization
[Technische Hochschule Deggendorf](https://www.th-deg.de/)

# Resources
**Requirements**
- Blockchain
    - Solidity [v. 0.8.17](https://docs.soliditylang.org/en/v0.8.17/)
- Front-end
    - Typescript [v. 4.8.*](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-8.html)
    - Next.js [v. 13.*.*](https://nextjs.org/)
    - GraphQL [v. 16.6.*](https://graphql.org/)

**Dependencies**
- Blockchain
    - Node.js [v. 16.17.*](https://nodejs.org/en/)
    - Truffle [v. 5.5.*](https://trufflesuite.com/)
    - Genache [v. 7.4.*](https://trufflesuite.com/ganache/)
    
- Front-end
    - React [v. 18.2.*](https://reactjs.org/versions/)
    - Material UI [v. 5.10.*](https://mui.com/material-ui/getting-started/overview/)
    - Ethers [v. 5.7.*](https://docs.ethers.org/v5/)
    - Wagmi [v. 0.7.*](https://wagmi.sh/)

**Development dependencies**
- Blockchain
    - @OpenZeppelin/contracts [v. 4.*](https://www.openzeppelin.com/contracts)
    - @OpenZeppelin/test-helpers [v. 0.5](https://docs.openzeppelin.com/test-helpers/0.5/)
- Front-end
    - NFT.Storage [v. 7.0.*](https://nft.storage/docs/)
    - SWR [v. 1.3.*](https://swr.vercel.app/)
- Graph
    - Typescript [v. 4.8.*](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-8.html)

# Abstract
It is anticipated that the worldwide market for car sharing will expand as a result of government programs aimed at reducing pollution, higher taxi rates, and the decreased demand for personal automobiles brought about by remote work. When car sharing is done, however, there may be problems with trust between clients and car owners, and there may also be security issues.

Using a blockchain is one way to make a carsharing business more accessible to users while also making sure that money transfers are safe and easy. In this paper, we will investigate a blockchain use case for vehicle sharing; describe how to construct a smart contract for car sharing services, and demonstrate how users may interact with this contract via the use of a simple decentralized application. Anyone interested in learning more about how blockchain technology may be used to secure vehicle sharing services should read this paper.

The results that were obtained show that a smart contract implementation for the carsharing system using the Solidity programming language is capable of reaching the required user security trust when compared to the default software implementation of it. This was demonstrated by the fact that the smart contract implementation used the Solidity programming language. In this investigation, a Decentralized Application (dApp) is used to demonstrate the written smart contract that is stored on the blockchain.

# Getting Started
**Blockchain**

Contracts have been deployed on the [Goerli Testnet](https://goerli.net/) network.
- Marketplace contract https://goerli.etherscan.io/address/0x4D95b0Cde53616862fBa18653F1F46c84D687177
- RentableVehicles contract https://goerli.etherscan.io/address/0xdC03f2784fb00C61fb06d348ec1b75F0B9819609

**Front-end**
- System Requirements
    - [Node.js 14.6.0](https://nodejs.org/en/) or newer
    - MacOS, Windows (including WSL), and Linux are supported
- Setup Project
    - Navigate to client folder ```cd ./client```
    - Run ```npm run dev``` to start the development server on http://localhost:3000
    - Visit http://localhost:3000 to view your application

## Demo
**Add a vehicle**

https://user-images.githubusercontent.com/10099935/209998379-cdf47bf5-debd-4f7c-be8a-d3e202d13a89.mp4

**Rent a vehicle**

https://user-images.githubusercontent.com/10099935/209999101-73c4720f-5891-4666-b16c-cb6962495cac.mp4

# Summary
We have shown how to properly manage transactions by placing funds in escrow to safeguard the system. The end product is an application consisting of a web client application that communicates with the Ethereum blockchain, utilizing smart contracts as the main store to handle carsharing rentals accurately. In addition, I would like to emphasize that, despite the final product, several issues were resolved throughout the development period.
I would like to emphasize that blockchain development differs significantly from client-server programming and requires a different strategy. Using this thesis, we have shown that it is viable and safe to establish a decentralized car-sharing service.
For future work, another smart contract could be implemented to cover the user identification check with the user’s driver’s license and user ID, and in this case, the application would be ready to publish.
