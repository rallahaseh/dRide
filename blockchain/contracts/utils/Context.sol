// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

/**
* @dev It provides information about the current execution context, including the 
* sender of the transaction and its data. Even though these are usually available 
* through msg.sender and msg.data, they shouldn't be accessed in this way because, 
* when dealing with meta-transactions, the account sending and paying for execution 
* may not be the actual sender (as far as an application is concerned). 
*/

/// This contract is only necessary for contracts that are intermediate in form, such as libraries.

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}