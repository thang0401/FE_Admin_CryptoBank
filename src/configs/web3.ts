import Web3 from "web3";

// Thông tin contract
const CONTRACT_ADDRESS = "0xb215a9b626d428e342154dd5be7dacbe6d757734"; // Thay bằng địa chỉ contract của bạn

const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenizer",
				"type": "address"
			}
		],
		"name": "addTokenizer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
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
				"internalType": "string",
				"name": "savingAccountId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ownerName",
				"type": "string"
			}
		],
		"name": "ContractCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "savingAccountId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "term",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "startDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endDate",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "supportStaff",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "ggDriveUrl",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "ownerName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "ownerId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "email",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "phone",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "status",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "heirStatus",
						"type": "string"
					}
				],
				"internalType": "struct TokenizedSavingContract.ContractInput",
				"name": "input",
				"type": "tuple"
			}
		],
		"name": "createContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenizer",
				"type": "address"
			}
		],
		"name": "removeTokenizer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "savingAccountId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "status",
				"type": "string"
			}
		],
		"name": "StatusUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "tokenizer",
				"type": "address"
			}
		],
		"name": "TokenizerAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "tokenizer",
				"type": "address"
			}
		],
		"name": "TokenizerRemoved",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_savingAccountId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_status",
				"type": "string"
			}
		],
		"name": "updateStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "allowedTokenizers",
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
		"name": "contractIds",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "contracts",
		"outputs": [
			{
				"internalType": "string",
				"name": "savingAccountId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "term",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "startDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endDate",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "supportStaff",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "ggDriveUrl",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "ownerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "ownerId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "email",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "phone",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "heirStatus",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllContracts",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "savingAccountId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "term",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "startDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endDate",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "supportStaff",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "ggDriveUrl",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "ownerName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "ownerId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "email",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "phone",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "status",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "heirStatus",
						"type": "string"
					}
				],
				"internalType": "struct TokenizedSavingContract.InheritingContract[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractCount",
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
				"internalType": "string",
				"name": "_savingAccountId",
				"type": "string"
			}
		],
		"name": "getContractDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "savingAccountId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "term",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "startDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endDate",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "supportStaff",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "ggDriveUrl",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "ownerName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "ownerId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "email",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "phone",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "status",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "heirStatus",
						"type": "string"
					}
				],
				"internalType": "struct TokenizedSavingContract.InheritingContract",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "isTokenizerAllowed",
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
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// RPC URL cho Arbitrum Sepolia
const RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc";

// Khởi tạo provider cho read-only
export const getWeb3 = (): Web3 => {
  return new Web3(RPC_URL);
};

// Khởi tạo contract instance cho read-only
export const getContract = (): any => {
  const web3 = getWeb3();
  return new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
};

// Khởi tạo contract với signer (MetaMask)
export const getContractWithSigner = async (): Promise<any> => {
  if (typeof window !== "undefined" && window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      // Yêu cầu quyền truy cập ví
      await window.ethereum.request({ method: "eth_requestAccounts" });
      return new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    } catch (error: any) {
      throw new Error("Failed to connect to MetaMask: " + error.message);
    }
  }
  throw new Error("Please install MetaMask!");
};
