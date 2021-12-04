const assert = require("assert");
const Web3 = require("web3");
const ganache = require("ganache-cli");
const { abi, evm } = require('../compile');

// run commmand --> npm test within this directory to run the mocha test cases

const web3 = new Web3(ganache.provider()); // Using the ganache test network

let accounts;
let lottery;

// Initializing both account list and lottery contract deployment prior to suite of tests 

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(abi)
                        .deploy({ data: evm.bytecode.object })
                        .send({ gas: 1000000, from: accounts[0] });                        
});

describe("Initialization of account addresses and lottery contract deployment", () => {
    it("Account addresses", () => {
        assert(accounts.length > 0);
    });

    it("Lottery contract deployment and address", () => {
        assert(lottery.options.address !== undefined);
    });
});

describe("Contract functionality and entry", () => {
    it("Single player entry", async () => {
        await lottery.methods.enter().send({ // Sending a player (also manager) to test entry
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const entry = await lottery.methods.getPlayers().call();

        assert(entry[0] == accounts[0]); // Check if the address equals entry
        assert(entry.length === 1);
    });

    it("Multiple player entry", async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('2', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('2', 'ether')
        });

        const entry = await lottery.methods.getPlayers().call(); // Testing multiple player entry

        assert(entry[0] == accounts[0]);
        assert(entry[1] == accounts[1]);
        assert(entry[2] == accounts[2]);

        assert(entry.length === 3); // Check entries match length
    });

    it("Player entry with insufficient ETH balance", async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.005', 'ether') // entering insufficient balance of ether for entry
            });
            assert(false); // If allowed, fail test immediately
        }
        catch (err){
            assert(err); // If error is caught, pass test
        }
    });
});

describe("Picking winner", () => {
    it("Manager picks winner", async () => {
        await lottery.methods.enter().send({ // Sending a player to test entry
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        try {
            await lottery.methods.pickWinner().send({ 
                from: accounts[0]
            });
            assert(true); // Pass test immediately, should correct assignee draw winner
        }
        catch (err){
            assert(!err); // If correct assignee cannot draw, fail test
        }
    });

    it("Wrong player picks winner", async () => {
        await lottery.methods.enter().send({ // Sending a player to test entry
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        try {
            await lottery.methods.pickWinner().send({ 
                from: accounts[1]
            });
            assert(false); // Fail test immediately, should incorrect assignee draw winner
        }
        catch (err){
            assert(err); // If incorrect assignee cannot draw, pass test
        }
    });
});

describe("Assigning appropriate ETH to winner", () => {
    it("Picking Winner", async () => {
        await lottery.methods.enter().send({ // Sending players to test entry
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });
        
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(lottery.options.address); // Retrieve total value held within contract
        
        assert(initialBalance - 4000000000000000000 <= 0.005) // The difference after gas should be minimal (entry is 4 ETH or 4*10^18 Wei)
        
        try {
            await lottery.methods.pickWinner().send({ 
                from: accounts[0]
            });
            
            const finalBalance = await web3.eth.getBalance(lottery.options.address);
            const playerEntry = lottery.methods.getPlayers().call();

            assert(finalBalance == 0); // Check to see if all the eth is transferred (contract should contain nothing)
            assert(playerEntry.length === 0); // Check to see the list reset after winner selected
            
        }
        catch (err){
            assert(!err); // If correct assignee cannot draw, fail test
        }
    });
});