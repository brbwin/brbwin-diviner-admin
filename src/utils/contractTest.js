import { ethers } from "ethers";
import Greeter from "../config/abis/Greeter.json";
import Token from "../config/abis//Token.json";
import { greeterAddress, tokenAddress } from "../constants/listAddress";

const requestAccount = async () => {
  await window.ethereum.request({ method: "eth_requestAccounts" });
};

export const fetchGreeting = async () => {
  console.log("a");
  if (typeof window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
    console.log("Balance: ", contract);
    try {
      const data = await contract.greet();
      console.log("data:", data);
    } catch (err) {
      console.log("Error:", err);
    }
  }
};

export const getBalance = async () => {
  if (typeof window.ethereum !== "undefined") {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
    // const balance = await contract.balanceOf(account);
    console.log("Balance: ", contract);
  }
};

export const setGreeting = async (greeting) => {
  if (!greeting) return;
  if (typeof window.ethereum !== "undefined") {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
    const transaction = await contract.setGreeting(greeting);
    await transaction.wait();
    fetchGreeting();
  }
};

export const sendCoins = async (userAccount, amount) => {
  if (typeof window.ethereum !== "undefined") {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
    const transation = await contract.transfer(userAccount, amount);
    await transation.wait();
    console.log(`${amount} Coins successfully sent to ${userAccount}`);
  }
};
