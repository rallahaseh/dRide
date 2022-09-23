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
        uint256 expiryDate; // Rental expiry date
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
            "End date cannot be older than start date"
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
        uint256 expiryDate
    );
    event NFTUnlisted(
        address unlistSender,
        address nftContract,
        uint256 tokenId,
        uint256 refund
    );
    event NFTRented(
        address owner,
        address user,
        address nftContract,
        uint256 tokenId,
        uint256 startDateUNIX,
        uint256 endDateUNIX,
        uint64 expiryDate,
        uint256 rentalFee
    );

    constructor() {
        _warehouseOwner = msg.sender;
    }

    /**
     * @notice List an NFT
     * @dev Modifiers
     * - Check the NFT is ERC4907 and ERC721 compliant
     * - Check if the owner of the NFT is on the list.
     * - Check if the listing properties (i.e., price, start date, and end date) are valid values.
     * - Check if the owner has enough balance in the ETH wallet to cover the listing fee.
     * - Check if the NFT has not already been listed.
     * - To protect against reentrancy attacks.
     * @param nftContract  Contract address
     * @param tokenId  Generated token id
     * @param pricePerDay  Price/day
     * @param startDateUNIX  UNIX timestamp start date
     * @param endDateUNIX  UNIX timestamp expiry date
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
        require(
            isRentableNFT(nftContract),
            "The contract is not ERC4907 protocol."
        );
        require(
            _listingMap[nftContract][tokenId].nftContract == address(0),
            "This NFT was included on the list before."
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

    /**
     * @notice Unlist your rental from an NFT (Also refunding user, if there is lost time)
     * @dev Modifiers
     * - To protect against reentrancy attacks
     * @param nftContract  Contract address
     * @param tokenId  Generated token id
     */
    function unlistNFT(address nftContract, uint256 tokenId)
        public
        payable
        nonReentrant
    {
        Listing storage listing = _listingMap[nftContract][tokenId];
        require(
            listing.owner != address(0),
            "This NFT is not included in the list."
        );
        require(
            listing.owner == msg.sender || _warehouseOwner == msg.sender,
            "The request to delist NFT was denied."
        );
        // The fee will be returned to the user if the listing is taken down before the end of the rental period,
        // but there will be no refund if there is no renter.
        uint256 refund = 0;
        if (listing.renter != address(0)) {
            uint256 diff = listing.expiryDate - block.timestamp;
            uint256 perDiem = diff / 60 / 60 / 24 + 1;
            refund = perDiem * listing.pricePerDay;
            require(
                msg.value >= refund,
                "Could not proceed refund because there is not enough ETH in your wallet"
            );
            payable(listing.renter).transfer(refund);
        }
        // Remove user data
        IERC4907(nftContract).setUser(tokenId, address(0), 0);
        EnumerableSet.remove(_nftContractTokensMap[nftContract], tokenId);
        delete _listingMap[nftContract][tokenId];
        if (EnumerableSet.length(_nftContractTokensMap[nftContract]) == 0) {
            EnumerableSet.remove(_nftContracts, nftContract);
        }
        _nftsListed.decrement();

        emit NFTUnlisted(msg.sender, nftContract, tokenId, refund);
    }

    /**
     * @notice Rent an NFT
     * @dev Modifiers
     * - To protect against reentrancy attacks
     * @param nftContract  Contract address
     * @param tokenId  Generated token id
     * @param expiryDate  Rental period
     */
    function rentNFT(
        address nftContract,
        uint256 tokenId,
        uint64 expiryDate
    ) public payable nonReentrant {
        Listing storage listing = _listingMap[nftContract][tokenId];
        require(
            listing.renter == address(0) ||
                block.timestamp > listing.expiryDate,
            "NFT has already been rented."
        );
        require(
            expiryDate <= listing.endDateUNIX,
            "The rental period exceeds the maximum date rentable."
        );
        // Transfer rental fee
        uint256 numDays = (expiryDate - block.timestamp) / 60 / 60 / 24 + 1; // Calculate number of days
        uint256 rentalFee = listing.pricePerDay * numDays; // Total amount of fees
        require(
            msg.value >= rentalFee,
            "Could not proceed because there is not enough ETH in your wallet to cover rental period"
        );
        payable(listing.owner).transfer(rentalFee);
        // Update listing
        IERC4907(nftContract).setUser(tokenId, msg.sender, expiryDate); // Set owner
        listing.renter = msg.sender; // Set renter
        listing.expiryDate = expiryDate; // Set NFT expiry date

        emit NFTRented(
            IERC721(nftContract).ownerOf(tokenId),
            msg.sender,
            nftContract,
            tokenId,
            listing.startDateUNIX,
            listing.endDateUNIX,
            expiryDate,
            rentalFee
        );
    }
}
