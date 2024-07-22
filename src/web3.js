import { ethers } from "ethers";

let provider;
let signer;
let contract;
let accounts;

const contractAddress = "0x4bbbc97a032e63b0045e2474e59062e6c0fb8163";
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "createFundraiser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_fundraiserId",
				"type": "uint256"
			}
		],
		"name": "donate",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "fundraiserId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "DonationReceived",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "fundraiserId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			}
		],
		"name": "FundraiserCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "fundraiserId",
				"type": "uint256"
			}
		],
		"name": "FundraiserRemoved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "fundraiserId",
				"type": "uint256"
			}
		],
		"name": "QuadraticFundingStarted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_fundraiserId",
				"type": "uint256"
			}
		],
		"name": "removeFundraiser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_fundraiserId",
				"type": "uint256"
			}
		],
		"name": "startQuadraticFunding",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "donations",
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
		"name": "fundraisers",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address payable",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "totalDonations",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "donationCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getFundraisers",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "address payable",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "totalDonations",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "donationCount",
						"type": "uint256"
					}
				],
				"internalType": "struct FundraisingApp.Fundraiser[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export async function connectWallet() {
    if (window.ethereum) {
        accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
        console.log("Please install MetaMask!");
    }
}
        
export async function connectContract(){
    if(window.ethereum){
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
    }
}

export async function createFundraiser(name) {
    const tx = await contract.createFundraiser(name, {
        gasLimit: 1000000
    });
    await tx.wait();
}

export async function donate(fundraiserId, amount) {
    const tx = await contract.donate(fundraiserId, { value: ethers.utils.parseEther(amount) });
    await tx.wait();
}

export async function startQuadraticFunding(fundraiserId) {
    const tx = await contract.startQuadraticFunding(fundraiserId);
    await tx.wait();
}

export async function getFundraisers() {
    try {
        const fundraisers = await contract.getFundraisers();
        console.log("Fundraisers fetched:", fundraisers);
        return fundraisers;
    } catch (error) {
        console.error("Failed to fetch fundraisers:", error);
        throw error;
    }
}

export async function removeFundraiser(fundraiserId) {
    try {
        const tx = await contract.removeFundraiser(fundraiserId);
        await tx.wait();
        console.log("Fundraiser removed successfully:", tx);
    } catch (error) {
        console.error("Failed to remove fundraiser:", error);
        throw error;
    }
}