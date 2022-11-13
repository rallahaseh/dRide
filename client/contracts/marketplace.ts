export const address = '0xBF8cA3696840CCAA2Cb69f66DF9F7722a6A02B09';

export const abi = [
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "pricePerDay",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "startDateUNIX",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "endDateUNIX",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "expiryDate",
                "type": "uint256"
            }
        ],
        "name": "NFTListed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "startDateUNIX",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "endDateUNIX",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint64",
                "name": "expiryDate",
                "type": "uint64"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "rentalFee",
                "type": "uint256"
            }
        ],
        "name": "NFTRented",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "unlistSender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "refund",
                "type": "uint256"
            }
        ],
        "name": "NFTUnlisted",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "getAllListings",
        "outputs": [
            {
                "components": [
                    { "internalType": "address", "name": "owner", "type": "address" },
                    { "internalType": "address", "name": "renter", "type": "address" },
                    {
                        "internalType": "address",
                        "name": "nftContract",
                        "type": "address"
                    },
                    { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
                    {
                        "internalType": "uint256",
                        "name": "pricePerDay",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startDateUNIX",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endDateUNIX",
                        "type": "uint256"
                    },
                    { "internalType": "uint256", "name": "expiryDate", "type": "uint256" }
                ],
                "internalType": "struct Marketplace.Listing[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "nftContract", "type": "address" }
        ],
        "name": "isRentableNFT",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "nftContract", "type": "address" },
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
            { "internalType": "uint256", "name": "pricePerDay", "type": "uint256" },
            { "internalType": "uint256", "name": "startDateUNIX", "type": "uint256" },
            { "internalType": "uint256", "name": "endDateUNIX", "type": "uint256" }
        ],
        "name": "listNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "nftContract", "type": "address" },
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
            { "internalType": "uint64", "name": "expiryDate", "type": "uint64" }
        ],
        "name": "rentNFT",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "nftContract", "type": "address" },
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "unlistNFT",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
] as const;
