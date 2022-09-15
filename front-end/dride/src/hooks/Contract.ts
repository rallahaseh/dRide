import { Contract } from "ethers";
import { Interface } from "ethers/lib/utils";

const contractAddress = "0x2c61461ca2a1151acc25841796622780cb7b37c0";
const ABI = new Interface( [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "contractId",
          "type": "uint256"
        }
      ],
      "name": "Finished",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "carId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "contractId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "insuranceDeposit",
          "type": "uint256"
        }
      ],
      "name": "InsurancePackageAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "id",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "carId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "from",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "to",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "dayscount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalCost",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "insuranceDeposit",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "dateOfIssuance",
          "type": "uint256"
        }
      ],
      "name": "NewContract",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "name",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "brand",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "vehicleType",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "latitude",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "longitude",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "model",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "image",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rentCost",
          "type": "uint256"
        }
      ],
      "name": "NewVehicle",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "contractId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "carId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalAmount",
          "type": "uint256"
        }
      ],
      "name": "ProceedPayment",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "contractId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "insuranceDeposit",
          "type": "uint256"
        }
      ],
      "name": "ReturnInsuranceDeposit",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "OWNER_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "RENTER_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "carId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "contractId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "insuranceDeposit",
          "type": "uint256"
        }
      ],
      "name": "addInsurancePackage",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "addOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "carId",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "from",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "to",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "dayscount",
          "type": "uint256"
        }
      ],
      "name": "addRentPeriod",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "addRenter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "name",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "brand",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "vehicleType",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "latitude",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "longitude",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "model",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "image",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "rentCost",
          "type": "uint256"
        }
      ],
      "name": "addVehicle",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "contractId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "carId",
          "type": "uint256"
        }
      ],
      "name": "completion",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "contractId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "carId",
          "type": "uint256"
        }
      ],
      "name": "confirmation",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "contractCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "contracts",
      "outputs": [
        {
          "internalType": "address",
          "name": "id",
          "type": "address"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "name",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "brand",
              "type": "bytes32"
            },
            {
              "internalType": "enum Rental.VehicleType",
              "name": "vehicleType",
              "type": "uint8"
            },
            {
              "components": [
                {
                  "internalType": "bytes32",
                  "name": "latitude",
                  "type": "bytes32"
                },
                {
                  "internalType": "bytes32",
                  "name": "longitude",
                  "type": "bytes32"
                }
              ],
              "internalType": "struct Rental.Coordinate",
              "name": "location",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "model",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "image",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "rentCost",
              "type": "uint256"
            },
            {
              "internalType": "enum Rental.VehicleStatus",
              "name": "status",
              "type": "uint8"
            }
          ],
          "internalType": "struct Rental.Vehicle",
          "name": "selectedVehicle",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "from",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "to",
              "type": "bytes32"
            }
          ],
          "internalType": "struct Rental.Period",
          "name": "period",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "totalCost",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "insuranceDeposit",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "dateOfIssuance",
          "type": "uint256"
        },
        {
          "internalType": "enum Rental.ContractStatus",
          "name": "status",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "getContractByID",
      "outputs": [
        {
          "internalType": "address",
          "name": "id",
          "type": "address"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "name",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "brand",
              "type": "bytes32"
            },
            {
              "internalType": "enum Rental.VehicleType",
              "name": "vehicleType",
              "type": "uint8"
            },
            {
              "components": [
                {
                  "internalType": "bytes32",
                  "name": "latitude",
                  "type": "bytes32"
                },
                {
                  "internalType": "bytes32",
                  "name": "longitude",
                  "type": "bytes32"
                }
              ],
              "internalType": "struct Rental.Coordinate",
              "name": "location",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "model",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "image",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "rentCost",
              "type": "uint256"
            },
            {
              "internalType": "enum Rental.VehicleStatus",
              "name": "status",
              "type": "uint8"
            }
          ],
          "internalType": "struct Rental.Vehicle",
          "name": "selectedVehicle",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "from",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "to",
              "type": "bytes32"
            }
          ],
          "internalType": "struct Rental.Period",
          "name": "period",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "totalCost",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "insuranceDeposit",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "dateOfIssuance",
          "type": "uint256"
        },
        {
          "internalType": "enum Rental.ContractStatus",
          "name": "status",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getRoleMember",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleMemberCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "getVehicleByID",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "name",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "brand",
          "type": "bytes32"
        },
        {
          "internalType": "enum Rental.VehicleType",
          "name": "vehicleType",
          "type": "uint8"
        },
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "latitude",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "longitude",
              "type": "bytes32"
            }
          ],
          "internalType": "struct Rental.Coordinate",
          "name": "location",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "model",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "image",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "rentCost",
          "type": "uint256"
        },
        {
          "internalType": "enum Rental.VehicleStatus",
          "name": "status",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isOwner",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isRenter",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "paymentProcess",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "removeOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "removeRenter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceRenter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "vehicleCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "vehicles",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "name",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "brand",
          "type": "bytes32"
        },
        {
          "internalType": "enum Rental.VehicleType",
          "name": "vehicleType",
          "type": "uint8"
        },
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "latitude",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "longitude",
              "type": "bytes32"
            }
          ],
          "internalType": "struct Rental.Coordinate",
          "name": "location",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "model",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "image",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "rentCost",
          "type": "uint256"
        },
        {
          "internalType": "enum Rental.VehicleStatus",
          "name": "status",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]);

export const contract = new Contract(contractAddress, ABI);