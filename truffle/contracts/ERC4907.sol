// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./IERC4907.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ERC4907 is ERC721URIStorage, IERC4907 {
    struct UserInfo {
        address user; // address of user role
        uint64 expires; // unix timestamp, expiration token date
    }

    mapping(uint256 => UserInfo) internal _users;

    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
    {}

    /// @notice Configure the user and the expiration date of the NFT.
    /// @dev Returning a zero address indicates that there is no user.
    /// Throws an error if the 'tokenId' is not valid NFT.
    /// @param tokenId  Token id of the new user NFT
    /// @param user  Address of the new user
    /// @param expires  Timestamp, the new user could use the NFT before expires
    function setUser(
        uint256 tokenId,
        address user,
        uint64 expires
    ) public virtual override {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        UserInfo storage info = _users[tokenId];
        info.user = user;
        info.expires = expires;
        emit UpdateUser(tokenId, user, expires);
    }

    /// @notice Retrieve the user address by token id.
    /// @dev Returning a zero address indicates that there is no user or the token has expired.
    /// @param tokenId Is a reference to the NFT
    /// @return address NFT user address
    function userOf(uint256 tokenId)
        public
        view
        virtual
        override
        returns (address)
    {
        if (uint256(_users[tokenId].expires) >= block.timestamp) {
            return _users[tokenId].user;
        } else {
            return address(0);
        }
    }

    /// @notice Retrieve the expiration date of an NFT related to a user.
    /// @dev Returning a zero address indicates that there is no user.
    /// @param tokenId Is a reference to the NFT
    /// @return uint256 The NFT expiration date for the requested user
    function userExpires(uint256 tokenId)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _users[tokenId].expires;
    }

    /**
     * @dev This function will return true if the interface identified by 'interfaceId' is
     * one that is implemented by this contract.
     *
     * See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return
            interfaceId == type(IERC4907).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev This function will make sure that the transaction will not be transferred to
     * the same user who already has the NFT.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        if (from != to && _users[tokenId].user != address(0)) {
            delete _users[tokenId];
            emit UpdateUser(tokenId, address(0), 0);
        }
    }
}