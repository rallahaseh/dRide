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
