require('dotenv').config();

require("@nomiclabs/hardhat-ethers");
const { GOERLI_API_URL, DRIDE_PRIVATE_KEY } = process.env;

/**
* @type import('hardhat/config').HardhatUserConfig
*/
module.exports = {
   solidity: "0.8.16",
   defaultNetwork: "goerli",
   networks: {
      hardhat: {},
      goerli: {
         url: GOERLI_API_URL,
         accounts: [`0x${DRIDE_PRIVATE_KEY}`]
      }
   },
}