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
    // Takes a list of tokens and converts NFT contracts into those tokens.
    mapping(address => EnumerableSet.UintSet) private _nftContractTokensMap;
    // Monitors the nft contracts that have been posted on the website.
    EnumerableSet.AddressSet private _nftContracts;

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

    /// Events
    event NFTListed(
        address owner,
        address user,
        address nftContract,
        uint256 tokenId,
        uint256 pricePerDay,
        uint256 startDateUNIX,
        uint256 endDateUNIX,
        uint256 expires
    );

    constructor() {
        _warehouseOwner = msg.sender;
    }

    /**
     * @notice List an NFT
     * @dev Modifiers
     * - Check the NFT is ERC4907 and ERC721 compliant
     * @param nftContract  Contract address
     * @param tokenId  Generated token id
     * @param pricePerDay  Price/day
     * @param startDateUNIX  UNIX timestamp start date
     * @param endDateUNIX  UNIX timestamp expires date
     */
    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 pricePerDay,
        uint256 startDateUNIX,
        uint256 endDateUNIX
    )
        public
        ownerOfIERC721(nftContract, tokenId)
        correctPrice(pricePerDay)
        validateStartDate(startDateUNIX)
        validateEndDate(startDateUNIX, endDateUNIX)
        nonReentrant
    {
        require(isRentableNFT(nftContract), "Contract is not an ERC4907");
        require(
            _listingMap[nftContract][tokenId].nftContract == address(0),
            "This NFT has already been listed"
        );
        _listingMap[nftContract][tokenId] = Listing(
            msg.sender,
            address(0),
            nftContract,
            tokenId,
            pricePerDay,
            startDateUNIX,
            endDateUNIX,
            0
        );
        _nftsListed.increment();
        EnumerableSet.add(_nftContractTokensMap[nftContract], tokenId);
        EnumerableSet.add(_nftContracts, nftContract);
        emit NFTListed(
            IERC721(nftContract).ownerOf(tokenId),
            address(0),
            nftContract,
            tokenId,
            pricePerDay,
            startDateUNIX,
            endDateUNIX,
            0
        );
    }

    /// @dev A helper function for determining whether the token contract meets the standard.
    function isRentableNFT(address nftContract) public view returns (bool) {
        bool _isRentable = false;
        bool _isNFT = false;
        try
            IERC165(nftContract).supportsInterface(type(IERC4907).interfaceId)
        returns (bool rentable) {
            _isRentable = rentable;
        } catch {
            return false;
        }
        try
            IERC165(nftContract).supportsInterface(type(IERC721).interfaceId)
        returns (bool nft) {
            _isNFT = nft;
        } catch {
            return false;
        }
        return _isRentable && _isNFT;
    }
}
