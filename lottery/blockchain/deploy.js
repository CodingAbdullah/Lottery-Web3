require("dotenv").config({ path: '.env' });
const { abi, evm } = require('../blockchain/compile'); 
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

// Deploying to ROPSTEN TEST NETWORK, credentials hidden. Add your custom in a .env file

const provider = new HDWalletProvider({
    mnemonic: {
        phrase: process.env.MNEMONIC
      },
    providerOrUrl: process.env.ROPSTEN_NETWORK
});

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    
    const contract = await new web3.eth.Contract(abi)
                    .deploy({ data: evm.bytecode.object })
                    .send({ gas: 1000000, from: accounts[0] });

    provider.engine.stop();
};

deploy(); // Run deployment

