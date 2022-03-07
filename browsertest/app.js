//const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
// This function detects most providers injected at window.ethereum
//import detectEthereumProvider from '@metamask/detect-provider';

const ethereumButton = document.querySelector('.enableEthereumButton');

ethereumButton.addEventListener('click', async () => {
//Will Start the metamask extension
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
  }
getAccount();
});

getAccount();

async function getAccount() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    showAccount.innerHTML = account;
  }