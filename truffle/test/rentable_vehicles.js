/// @dev Use @openzeppelin/test-helpers library for testing
require("@openzeppelin/test-helpers/configure")({
  provider: web3.currentProvider,
  singletons: {
    abstraction: "truffle",
  },
});

const CONTRACT_NAME = "RentableVehicles";
const { constants, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const RentableVehicles = artifacts.require(CONTRACT_NAME);

contract(CONTRACT_NAME, function (accounts) {

  /**
   * Check the supported interface to make sure our contract
   * is using the ERC-4907 NFT renting protocol.
   * 
   */
  it("Should support the ERC721 and ERC4907 standards", async () => {
    const RentableVehiclesInstance = await RentableVehicles.deployed();
    const ERC721InterfaceId = "0x80ac58cd";
    const ERC4907InterfaceId = "0xad092b5c";
    var isERC721 = await RentableVehiclesInstance.supportsInterface(ERC721InterfaceId);
    var isER4907 = await RentableVehiclesInstance.supportsInterface(ERC4907InterfaceId);
    assert.equal(isERC721, true, "RentableVehicles is not an ERC721");
    assert.equal(isER4907, true, "RentableVehicles is not an ERC4907");
  });

  /**
   * Check if the NFT is not rented by a user to reassign it 
   * to a new user.
   * 
   */
  it("Should not set UserInfo if not the owner", async () => {
    const RentableVehiclesInstance = await RentableVehicles.deployed();
    const expirationDatePast = 1663452000; // Sep 18 2022
    await RentableVehiclesInstance.mint("fakeURI");
    // Failed require in function
    await expectRevert(RentableVehiclesInstance.setUser(1, accounts[1], expirationDatePast, { from: accounts[1] }), "ERC721: transfer caller is not owner nor approved");
    // Assert no UserInfo for NFT
    var user = await RentableVehiclesInstance.userOf.call(1);
    var date = await RentableVehiclesInstance.userExpires.call(1);
    assert.equal(user, constants.ZERO_ADDRESS, "NFT user is not zero address");
    assert.equal(date, 0, "NFT expiration date is not 0");
  });

  /**
  * Check if the NFT is not rented by a user to reassign it to a new user. 
  * Then check the expiration date, burn it, and the final check is to delete the user information.
  * 
  */
  it("Should return the correct UserInfo", async () => {
    const RentableVehiclesInstance = await RentableVehicles.deployed();
    const expirationDatePast = 1663884000; // Sep 23 2022
    const expirationDateFuture = 1664143200; // Sep 26 2022
    await RentableVehiclesInstance.mint("fakeURI");
    await RentableVehiclesInstance.mint("fakeURI");
    // Set and get UserInfo
    var expiredTx = await RentableVehiclesInstance.setUser(2, accounts[1], expirationDatePast)
    var unexpiredTx = await RentableVehiclesInstance.setUser(3, accounts[2], expirationDateFuture)
    var expiredNFTUser = await RentableVehiclesInstance.userOf.call(2);
    var expiredNFTDate = await RentableVehiclesInstance.userExpires.call(2);
    var unexpireNFTUser = await RentableVehiclesInstance.userOf.call(3);
    var unexpiredNFTDate = await RentableVehiclesInstance.userExpires.call(3);
    // Assert UserInfo and event transmission
    assert.equal(expiredNFTUser, constants.ZERO_ADDRESS, "Expired NFT has wrong user");
    assert.equal(expiredNFTDate, expirationDatePast, "Expired NFT has wrong expiration date");
    expectEvent(expiredTx, "UpdateUser", { tokenId: "2", user: accounts[1], expires: expirationDatePast.toString() });
    assert.equal(unexpireNFTUser, accounts[2], "Expired NFT has wrong user");
    assert.equal(unexpiredNFTDate, expirationDateFuture, "Expired NFT has wrong expiration date");
    expectEvent(unexpiredTx, "UpdateUser", { tokenId: "3", user: accounts[2], expires: expirationDateFuture.toString() });
    // Burn NFT
    unexpiredTx = await RentableVehiclesInstance.burn(3);
    // Assert UserInfo was deleted
    unexpireNFTUser = await RentableVehiclesInstance.userOf.call(3);
    unexpiredNFTDate = await RentableVehiclesInstance.userExpires.call(3);
    assert.equal(unexpireNFTUser, constants.ZERO_ADDRESS, "NFT user is not zero address");
    assert.equal(unexpiredNFTDate, 0, "NFT expiration date is not 0");
    expectEvent(unexpiredTx, "UpdateUser", { tokenId: "3", user: constants.ZERO_ADDRESS, expires: "0" });
  });
});