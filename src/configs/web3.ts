import Web3 from "web3";

// Thông tin contract
const CONTRACT_ADDRESS = "0xb215a9b626d428e342154dd5be7dacbe6d757734"; // Thay bằng địa chỉ contract của bạn


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
    } catch (error) {
      throw new Error("Failed to connect to MetaMask: " + error.message);
    }
  }
  throw new Error("Please install MetaMask!");
};
