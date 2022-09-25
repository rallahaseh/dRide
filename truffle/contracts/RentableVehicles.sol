// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ERC4907.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RentableVehicles is ERC4907 {
    using Counters for Counters.Counter;

    /// Variables
    address private _warehouseContract;
    Counters.Counter private _tokenIds;

    constructor(address warehouseContract) ERC4907("RentableVehicles", "RV") {
        _warehouseContract = warehouseContract;
    }

    /**
     * @dev Minting an NFT refers to converting digital files into crypto collections
     * or digital assets stored on the blockchain.
     */
    function mint(string memory _tokenURI) public {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        setApprovalForAll(_warehouseContract, true);
        _setTokenURI(newTokenId, _tokenURI);
    }

    /**
     * @dev Burning a non-fungible token means destroying it.
     */
    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }
}
