// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "./utils/AccessControl.sol";

abstract contract Access is AccessControl {

    bytes32 public constant OWNER_ROLE = "OWNER";
    bytes32 public constant RENTER_ROLE = "RENTER";
    
    // @dev Restricted to members of the owner role.
    modifier onlyOwner() {
        require(isOwner(msg.sender), "Restricted to owners.");
        _;
    }

    /// @dev Restricted to members of the renter role.
    modifier onlyRenter() {
        require(isRenter(msg.sender), "Restricted to renters.");
        _;
    }

        /// @dev Return `true` if the account belongs to the owner role.
    function isOwner(address account) public virtual view returns (bool) {
        return hasRole(OWNER_ROLE, account);
    }

    /// @dev Return `true` if the account belongs to the renter role.
    function isRenter(address account) public virtual view returns (bool) {
        return hasRole(RENTER_ROLE, account);
    }

    /// @dev Add an account to the renter role. Restricted to proposals.
    function addRenter(address account) public virtual {
        _grantRole(RENTER_ROLE, account);
    }

    /// @dev Add an account to the owner role. Restricted to proposals.
    function addOwner(address account) public virtual {
        _grantRole(OWNER_ROLE, account);
    }

    /// @dev Remove an account from the renter role. Restricted to proposals.
    function removeRenter(address account) public virtual {
        _revokeRole(RENTER_ROLE, account);
    }

    /// @dev Remove an account from the owner role. Restricted to proposals.
    function removeOwner(address account) public virtual {
        _revokeRole(OWNER_ROLE, account);
    }

     /// @dev Remove oneself from the leader role.
    function renounceOwner() public virtual {
        _revokeRole(OWNER_ROLE, msg.sender);
    }

    /// @dev Remove oneself from the renter role.
    function renounceRenter() public virtual {
        _revokeRole(RENTER_ROLE, msg.sender);
    }
}