const solc = require("solc");

const path = require("path");
const fs = require("fs");

// Resolving path to lottery smart contract within directory
const contract_info = fs.readFileSync(path.resolve(__dirname, 'contracts', 'lottery.sol'), { encoding: 'utf-8', flag: 'r' });

var input = {
    language: 'Solidity',
    sources: {
        'lottery.sol' : {
            content: contract_info
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
}; 

// Exporting compiled data as JSON object
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts['lottery.sol'].Lottery;

