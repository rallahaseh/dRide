// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Warehouse is ReentrancyGuard {
  constructor() public {
  }
    // Warehouse Owner
    address private _warehouseOwner;

    constructor() {
        _warehouseOwner = msg.sender;
    }
}
