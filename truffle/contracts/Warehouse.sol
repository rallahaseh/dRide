// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC165.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "./IERC4907.sol";

contract Warehouse is ReentrancyGuard {
    struct Listing {
        address owner;
        address renter;
        address nftContract; // NFT contract address
        uint256 tokenId; // NFT id
        uint256 pricePerDay; // Price
        uint256 startDateUNIX; // Rental start date
        uint256 endDateUNIX; // Rental end date
        uint256 expires; // Rental expiry date
    }
    // Translates contract address to token id, which is then mapped to the features of the rental listing
    mapping(address => mapping(uint256 => Listing)) private _listingMap;

    // Warehouse Owner
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;

    /// Variables
    Counters.Counter private _nftsListed;
    address private _warehouseOwner;

    /// Modifiers
    modifier ownerOfIERC721(address nftContract, uint256 tokenId) {
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "Not owner of nft"
        );
        _;
    }
    modifier correctPrice(uint256 price) {
        require(price > 0, "Rental price should be greater than 0");
        _;
    }
    modifier validateStartDate(uint256 date) {
        require(date >= block.timestamp, "Start date cannot be in the past");
        _;
    }
    modifier validateEndDate(uint256 startDate, uint256 endDate) {
        require(
            endDate >= startDate,
            "End date cannot be before the start date"
        );
        _;
    }
    constructor() {
        _warehouseOwner = msg.sender;
    }
}
