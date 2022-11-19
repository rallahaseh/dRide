// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC165.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "./IERC4907.sol";

contract Marketplace is ReentrancyGuard {
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
    // A list of staking for each user address
    mapping(address => uint) private stakingBalance;
    // Monitors the nft contracts that have been posted on the website.
    EnumerableSet.AddressSet private _nftContracts;

    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;

    /// Variables
    Counters.Counter private _nftsListed;
    address private _marketplaceOwner;
    uint8 private _rentFee;
    address private _paymentTokenAddress;

    /// Modifiers
    modifier ownerOfIERC721(address nftContract, uint256 tokenId) {
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "The following address is not the owner."
        );
        _;
    }
    modifier correctPrice(uint256 price) {
        require(price > 0, "The rental price should be greater than zero.");
        _;
    }
    modifier validateStartDate(uint256 date) {
        require(date >= block.timestamp, "The beginning date cannot be in the past.");
        _;
    }
    modifier validateEndDate(uint256 startDate, uint256 endDate) {
        require(
            endDate >= startDate,
            "The end date cannot be later than the beginning date."
        );
        _;
    }

    /// Events
    event NFTListed(
        address owner,
        address renter,
        address nftContract,
        uint256 tokenId,
        string tokenURI,
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
        address renter,
        address nftContract,
        uint256 tokenId,
        string tokenURI,
        uint256 startDateUNIX,
        uint256 endDateUNIX,
        uint64 expiryDate,
        uint256 rentalFee
    );

    constructor(address paymentTokenAddress, uint8 rentFee) {
        _marketplaceOwner = msg.sender;
        _paymentTokenAddress = paymentTokenAddress;
        _rentFee = rentFee;
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
        external
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
        string memory _tokenURI = IERC721Metadata(nftContract).tokenURI(tokenId);

        emit NFTListed(
            IERC721(nftContract).ownerOf(tokenId),
            address(0),
            nftContract,
            tokenId,
            _tokenURI,
            pricePerDay,
            startDateUNIX,
            endDateUNIX,
            0
        );
    }

    /// @dev A helper function for determining whether the token contract meets the standard.
    function isRentableNFT(address nftContract) private view returns (bool) {
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
        external
        payable
        nonReentrant
    {
        Listing storage listing = _listingMap[nftContract][tokenId];
        require(
            listing.owner != address(0),
            "This NFT is not included in the list."
        );
        require(
            listing.owner == msg.sender || _marketplaceOwner == msg.sender,
            "The request to delist NFT was denied because you are the owner or not the renter of this NFT"
        );
        // The fee will be returned to the user if the listing is taken down before the end of the rental period,
        // but there will be no refund if there is no renter.
        uint256 refundAmount = 0;
        if (listing.renter != address(0)) {
            uint256 diff = listing.expiryDate - block.timestamp;
            uint256 perDiem = diff / 60 / 60 / 24 + 1;
            refundAmount = perDiem * listing.pricePerDay;
            refund(refundAmount, listing.renter);
        }
        // Remove user data
        IERC4907(nftContract).setUser(tokenId, address(0), 0);
        EnumerableSet.remove(_nftContractTokensMap[nftContract], tokenId);
        delete _listingMap[nftContract][tokenId];
        if (EnumerableSet.length(_nftContractTokensMap[nftContract]) == 0) {
            EnumerableSet.remove(_nftContracts, nftContract);
        }
        _nftsListed.decrement();

        emit NFTUnlisted(msg.sender, nftContract, tokenId, refundAmount);
    }

    function refund(uint256 value, address beneficiary) private returns (uint256 amount) {
        ERC20 paymentToken = ERC20(_paymentTokenAddress);
        require(
            paymentToken.balanceOf(msg.sender) >= value,
            "Could not proceed because there is not enough balance in your wallet to cover rental period"
        );
        amount = value;
        paymentToken.transfer(beneficiary, amount);
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
        uint64 startDate,
        uint64 expiryDate
    ) external payable nonReentrant {
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
        uint256 numDays = (expiryDate - startDate) / 60 / 60 / 24 + 1; // Calculate number of days
        uint256 rentalFee = listing.pricePerDay * numDays; // Total amount of fees
        takeFee(rentalFee);
        // Update listing
        IERC4907(nftContract).setUser(tokenId, msg.sender, expiryDate); // Set owner
        listing.renter = msg.sender; // Set renter
        listing.expiryDate = expiryDate; // Set NFT expiry date
        string memory _tokenURI = IERC721Metadata(nftContract).tokenURI(tokenId);

        emit NFTRented(
            IERC721(nftContract).ownerOf(tokenId),
            msg.sender,
            nftContract,
            tokenId,
            _tokenURI,
            listing.startDateUNIX,
            listing.endDateUNIX,
            expiryDate,
            rentalFee
        );
    }

    function takeFee(uint256 value) private returns (uint256 amount) {
        ERC20 paymentToken = ERC20(_paymentTokenAddress);
        require(
            paymentToken.balanceOf(msg.sender) >= value,
            "Could not proceed because there is not enough balance in your wallet to cover rental period"
        );
        uint256 txValue = value * 10 ** 6;
        uint256 fee = txValue * (_rentFee / 100);
        amount = txValue - fee;
        stakingBalance[msg.sender] += amount;
        paymentToken.transferFrom(msg.sender, address(this), txValue);
    }

    /**
     * @notice Withdrawal user balance
     * @dev Modifiers
     * - To protect against reentrancy attacks
     */
     function withdrawal() external nonReentrant {
        uint256 balance = stakingBalance[msg.sender];
        require (
            balance > 0, 
            "Could not proceed because staking balance cannot be 0"
        );
        ERC20 paymentToken = ERC20(_paymentTokenAddress);
        paymentToken.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
     }

    /**
     * @notice Retreive the list of all listed NFTs
     * @dev This is function will be used only for testing
     * WARNING:
     * This procedure will transfer everything from storage into memory, which may be a very costly endeavor. 
     * This is intended to be utilized by accessors the majority of the time since there are no gas expenses
     * associated with querying them. Developers need to keep in mind that this function has an unbounded cost
     * and that if they use it as part of a function that changes the state, the function might become uncallable 
     * if the set grows to the point where copying it to memory requires too much gas to fit in a block. 
     * This is something that should be kept in mind at all times.
     * 
     */
    function getAllListings() external view returns (Listing[] memory) {
        Listing[] memory listings = new Listing[](_nftsListed.current());
        uint256 listingsIndex = 0;
        address[] memory nftContracts = EnumerableSet.values(_nftContracts);
        for (uint i = 0; i < nftContracts.length; i++) {
            address nftAddress = nftContracts[i];
            uint256[] memory tokens = EnumerableSet.values(_nftContractTokensMap[nftAddress]);
            for (uint j = 0; j < tokens.length; j++) {
                listings[listingsIndex] = _listingMap[nftAddress][tokens[j]];
                listingsIndex++;
            }
        }
        return listings;
    }
}
