// SPDX-License-Identifier: MIT

pragma solidity >= 0.4.0;

contract Lottery {
    address manager;
    address payable[] players;

    constructor() {
        manager = msg.sender; // Intitalizes manager that initiates this contract
    }

     modifier isManager {
        require(manager == msg.sender); // Ensure manager picks winner, pickWinner()
        _;
    }

    function enter() external payable {
        players.push(payable(msg.sender)); // Global object containing caller address 
    }

    function runAlgorithm() private view returns(uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))); // Algorithm to determine randomness for winner
    }

    function pickWinner() external isManager {
        uint value = runAlgorithm();
        uint winner = value % players.length; // Determine the random winner (0 - n-1) players

        players[winner].transfer(address(this).balance); // Transfer ETH balance from contract to winner
        players = new address payable[](0); // Reset players participating in lottery
    }
}