const assert = require("assert");
const Web3 = require("web3");
const ganache = require("ganache-cli");
const { abi, evm } = require('../compile');

// run commmand --> npm test within this directory to run the mocha test cases

const web3 = new Web3(ganache.provider()); // Using the ganache test network

let accounts;
let lottery;

// Initializing both account list and lottery contract deployment prior to suite of tests 

before(async () => {
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(abi)
                        .deploy({ data: evm.bytecode.object })
                        .send({ gas: 1000000, from: accounts[0] });                        
});

describe("Initialization of account addresses and lottery contract deployment", () => {
    it("Account addresses", () => {
        assert(accounts.length > 0);
        console.log(accounts);
    });

    it("Lottery contract deployment and address", () => {
        assert(lottery.options.address !== undefined);
        console.log(lottery.options.address);
    })
});

// More tests to be conducted later.. (for now both the accounts and lottery contract deploy successfully.)
