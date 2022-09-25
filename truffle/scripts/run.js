const Warehouse = artifacts.require("Warehouse");
const NFT_CONTRACT = "0x209e693036FeaDfe6EdCa80438CF64A0FD4dD1Ca";
const TOKEN_ID = 1;
const PRICE = 1;
const ERC721_ABI = [
    {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "userExpires",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "ownerOf",
        "outputs": [{"internalType": "address", "name": "owner", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }
];

const main = async (cb) => {
    try {
        const warehouse = await Warehouse.deployed();
        const nftContract = new web3.eth.Contract(ERC721_ABI, NFT_CONTRACT);
        const expires = await nftContract.methods.userExpires(TOKEN_ID).call();
        let value = (Math.floor((expires - Date.now()/1000)/60/60/24 + 1)) * PRICE;
        const owner = await nftContract.methods.ownerOf(TOKEN_ID).call();
        let options = value < 0 ? {from: owner} : {from: owner, value: value};
        let txn = await warehouse.unlistNFT(NFT_CONTRACT, TOKEN_ID, options);
        console.log(txn);
    } catch(err) {
        console.log(err);
    }
    cb();
}

module.exports = main;
