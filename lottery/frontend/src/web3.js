import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

// This returns the provider, or null if it wasn't detected
const provider = await detectEthereumProvider();
let web3;

function startApp(provider) {
    // If the provider returned by detectEthereumProvider is not the same as
    // window.ethereum, something is overwriting it, perhaps another wallet.
    if (provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');
    }
    // Access the decentralized web!
}

if (provider) {
    startApp(provider); // Initialize your app
    
    web3 = new Web3(provider);
} 
else {
    console.log('Please install MetaMask!');
}

export default web3;