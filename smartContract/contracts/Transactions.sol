//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0; 

contract Transactions {
    uint256 transactionCount;

    event transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    struct TransferStruct {
        address sender;
        address receiver;
        uint message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] transactions;

    function addToBlockchain () public {
        
    }

    function getAllTransactions () public view returns (TransferStruct [] memory){
        //returns transactions;
    }

    function getTransactionCount () public view returns (uint256) {
        //returns transactionCount;
    }
}
