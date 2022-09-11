// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0 < 0.9.0;

/**
 * @dev EnumerableMap, like Solidity’s mapping type, but with key-value enumeration: 
    this will let you know how many entries a mapping has, and iterate over them 
    (which is not possible with mapping).
 */
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

import "./Context.sol";

/**
 * @dev Contract for controlling access, with no built-in hierarchy and
 * the ability to use _grantRole and _revokeRole.
 */
abstract contract AccessControl is Context {
    using EnumerableSet for EnumerableSet.AddressSet;

    mapping (bytes32 => EnumerableSet.AddressSet) private _roles;

    /**
     * @dev Emitted when `account` is granted `role`.
     *
     * `sender` is the account that initiated the contract call and, with the exception of 
     * when using {_setupRole}, carries the admin role bearer status.
     */
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);

    /**
     * @dev Emitted when `account` is revoked `role`.
     *
     * `sender` is the account that originated the contract call:
     *   - if using `revokeRole`, it is the admin role bearer
     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
     */
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[role].contains(account);
    }

    /**
     * @dev This function returns the total number of accounts that contain the 'role' attribute.
     * It is possible to enumerate all bearers of a role by using this method in conjunction with 
     * the getRoleMember method.
     */
    function getRoleMemberCount(bytes32 role) public view returns (uint256) {
        return _roles[role].length();
    }

    /**
     * @dev This function will return one of the accounts that contain the 'role' attribute. 
     * The value of the 'index' variable must be between 0 and getRoleMemberCount,
     * excluding both numbers.
     *
     * There is no specific order to the people who hold roles, and the sequence in 
     * which they appear might shift at any time.
     *
     * WARNING: 
     * You need to make sure that all of your queries are performed on the same block 
     * when you are using {getRoleMember} and {getRoleMemberCount}.
     * For more information, take a look at the following:
     * https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post]
     */
    function getRoleMember(bytes32 role, uint256 index) public view returns (address) {
        return _roles[role].at(index);
    }

    function _grantRole(bytes32 role, address account) internal {
        if (_roles[role].add(account)) {
            emit RoleGranted(role, account, _msgSender());
        }
    }

    function _revokeRole(bytes32 role, address account) internal {
        if (_roles[role].remove(account)) {
            emit RoleRevoked(role, account, _msgSender());
        }
    }
}