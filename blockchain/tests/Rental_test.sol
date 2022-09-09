// SPDX-License-Identifier: GPL-3.0
        
pragma solidity >=0.4.22 <0.9.0;

// This import is automatically injected by Remix
import "remix_tests.sol"; 

// This import is required to use custom transaction context
// Although it may fail compilation in 'Solidity Compiler' plugin
// But it will work fine in 'Solidity Unit Testing' plugin
import "remix_accounts.sol";
import "../contracts/Rental.sol";

// File name has to end with '_test.sol', this file can contain more than one testSuite contracts
contract testSuite {

    Rental contractObjcet;
    Access accessObject;
    
    address owner;
    address renter;

    function beforeAll () public {
        // Init contract
        contractObjcet = new Rental();
        // Test accounts
        owner = TestsAccounts.getAccount(0);
        renter = TestsAccounts.getAccount(1);
        //
        contractObjcet.addRenter(renter);
    }

    /// Test if initial owner is set correctly
    function testInitialOwner() public {
        contractObjcet.addOwner(owner);
        // account at zero index (account-0) is default account, so current owner should be acc0
        Assert.equal(msg.sender, owner, "owner should be acc0");
    }
    
    function testAddVehicle() public {
         // check method caller is as expected
        Assert.ok(msg.sender == owner, "caller should be default account i.e. acc0");
        // This will pass
        try contractObjcet.addVehicle(0xce068f048feb6a9c2e3c7f9f72db888dd743bd1f933cc513cf759cf030a916a4, 0x7f8bbc6bae1993c314f73a773580dc1e60c8760e7463ecc7c199abdc3cf58db2, 3, 0xcc0594b877e25893ea2623b106b5e6e945462abe03edf68c28437df345efaf1e, 0xd000b426e62dae1f3a4eabc307eddb468a4d194f7e35cf4f62d85190868d1230, 2020, 0xd283f3979d00cb5493f2da07819695bc299fba34aa6e0bacb484fe07a2fc0ae0, 50) returns (bool result) {
            Assert.equal(result, true, "Car has been added successfully");
        } catch Error(string memory reason) {
            // This is executed in case
            // revert was called inside getData
            // and a reason string was provided.
            Assert.ok(false, reason);
        } catch (bytes memory /*lowLevelData*/) {
            // This is executed in case revert() was used
            // or there was a failing assertion, division
            // by zero, etc. inside getData.
            Assert.ok(false, "Failed unexpected");
        }
    }

    function testAddRentPeriod() public {
         // check method caller is as expected
        Assert.ok(msg.sender == renter, "caller should be default account i.e. acc1");
        // This will pass
        try contractObjcet.addRentPeriod(1, 0x2fa20e8de2e0c77e0b76a4052bc743d9e4c00f8d44799a131e1b80ddafff581e, 0x1ac576d7fb4bc609fb6129ea367677a9c1362c99bbb5de7ca45c93b1bfd42aaa, 3) returns (bool result) {
            Assert.equal(result, true, "Rental period has been added to the selected car successfully");
        } catch Error(string memory reason) {
            // This is executed in case
            // revert was called inside getData
            // and a reason string was provided.
            Assert.ok(false, reason);
        } catch (bytes memory /*lowLevelData*/) {
            // This is executed in case revert() was used
            // or there was a failing assertion, division
            // by zero, etc. inside getData.
            Assert.ok(false, "Failed unexpected");
        }
    }

    function testAddInsurancePackage() public {
        // check method caller is as expected
        Assert.ok(msg.sender == renter, "caller should be default account i.e. acc1");
        // This will pass
        try contractObjcet.addInsurancePackage(1, 1, 250) returns (bool result) {
            Assert.equal(result, true, "Insurance package has been added to the selected car successfully");
        } catch Error(string memory reason) {
            // This is executed in case
            // revert was called inside getData
            // and a reason string was provided.
            Assert.ok(false, reason);
        } catch (bytes memory /*lowLevelData*/) {
            // This is executed in case revert() was used
            // or there was a failing assertion, division
            // by zero, etc. inside getData.
            Assert.ok(false, "Failed unexpected");
        }
    }

    function testConfirmation() public {
        // check method caller is as expected
        Assert.ok(msg.sender == renter, "caller should be default account i.e. acc1");
        // This will pass
        try contractObjcet.confirmation(1, 1) returns (bool result) {
            Assert.equal(result, true, "Confirmation process to the selected car successfully completed");
        } catch Error(string memory reason) {
            // This is executed in case
            // revert was called inside getData
            // and a reason string was provided.
            Assert.ok(false, reason);
        } catch (bytes memory /*lowLevelData*/) {
            // This is executed in case revert() was used
            // or there was a failing assertion, division
            // by zero, etc. inside getData.
            Assert.ok(false, "Failed unexpected");
        }
    }

    function testCompletion() public {
        // check method caller is as expected
        Assert.ok(msg.sender == renter, "caller should be default account i.e. acc1");
        // This will pass
        try contractObjcet.completion(1, 1) returns (bool result) {
            Assert.equal(result, true, "Completion process to the selected car successfully completed");
        } catch Error(string memory reason) {
            // This is executed in case
            // revert was called inside getData
            // and a reason string was provided.
            Assert.ok(false, reason);
        } catch (bytes memory /*lowLevelData*/) {
            // This is executed in case revert() was used
            // or there was a failing assertion, division
            // by zero, etc. inside getData.
            Assert.ok(false, "Failed unexpected");
        }
    }
}
    