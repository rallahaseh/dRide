// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ERC4907.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RentableVehicles is ERC4907 {
    using Counters for Counters.Counter;

    /// Variables
    address private _marketplaceContract;
    Counters.Counter private _tokenIds;
    // List of minted token URIs
    mapping(uint256 => string) private tokenURIs;

    /// Events
    event mintedNFT(uint256 tokenId, string tokenURI, uint256 creationDate);
    event burntNFT(uint256 tokenId);

    constructor(address marketplaceContract) ERC4907("RentableVehicles", "RV") {
        _marketplaceContract = marketplaceContract;
    }

    /**
     * @dev Minting an NFT refers to converting digital files into crypto collections
     * or digital assets stored on the blockchain.
     */
    function mint(string memory _tokenURI) external returns (uint256 tokenID) {
        _tokenIds.increment();
        tokenID = _tokenIds.current();
        _safeMint(msg.sender, tokenID);
        setApprovalForAll(_marketplaceContract, true);
        _setTokenURI(tokenID, _tokenURI);
        tokenURIs[tokenID] = _tokenURI;
        
        emit mintedNFT(tokenID, _tokenURI, block.timestamp);
        return tokenID;
    }

    /**
     * @dev Burning a non-fungible token means destroying it.
     */
    function burn(uint256 tokenId) external {
        _burn(tokenId);
        delete tokenURIs[tokenId];

        emit burntNFT(tokenId);
    }
}
