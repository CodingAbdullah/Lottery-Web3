import Web3 from 'web3';

// This returns the provider, or null if it wasn't detected
const ethEnabled = async () => {
  if (window.ethereum) {
    await window.ethereum.send('eth_requestAccounts'); // Metamask pop-up
    window.web3 = new Web3(window.ethereum);
  }
  else {
    return false;
  }
  return true;
}

ethEnabled();

export default window.web3;