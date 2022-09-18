// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./IERC4907.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ERC4907 is ERC721URIStorage, IERC4907 {
}
    struct UserInfo {
        address user; // address of user role
        uint64 expires; // unix timestamp, expiration token date
    }

    mapping(uint256 => UserInfo) internal _users;
