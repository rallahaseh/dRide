require("@openzeppelin/test-helpers/configure")({
  provider: web3.currentProvider,
  singletons: {
    abstraction: "truffle",
  },
});

const { balance, constants, ether, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const MARKETPLACE_CONTRACT_NAME = "Marketplace";
const RENTABLE_CONTRACT_NAME = "RentableVehicles";

const Marketplace = artifacts.require(MARKETPLACE_CONTRACT_NAME);
const RentableVehicles = artifacts.require(RENTABLE_CONTRACT_NAME);

const TODAY = Math.floor(Date.now() / 1000);
const TODAY_2 = TODAY + (60 * 60);
const YESTERDAY = TODAY - (24 * 60 * 60);
const TOMORROW = TODAY + (24 * 60 * 60);
const IN_FIVE_DAYS = TODAY + (24 * 60 * 60 * 5);

function assertListing(actual, expected) {
  assert.equal(actual.owner, expected.owner, "Owner is not correct");
  assert.equal(actual.renter, expected.renter, "User is not correct");
  assert.equal(actual.nftContract, expected.nftContract, "NFT contract is not correct");
  assert.equal(actual.tokenId, expected.tokenId, "TokenId is not correct");
  assert.equal(actual.pricePerDay, expected.pricePerDay, "Price per day is not correct");
  assert.equal(actual.startDateUNIX, expected.startDateUNIX, "Start date is not correct");
  assert.equal(actual.endDateUNIX, expected.endDateUNIX, "End date is not correct");
  assert.equal(actual.expiryDate, expected.expiryDate, "Expires date is not correct");
}

async function assertNFT(nftContractInstance, tokenId, expectedUser, expectedExpires) {
  let renter = await nftContractInstance.userOf.call(tokenId);
  let expires = await nftContractInstance.userExpires.call(tokenId);
  assert.equal(renter, expectedUser, "User is not correct");
  assert.equal(expires, expectedExpires, "Expires date is incorrect");
}

// EnumerableSet makes no guarantee about ordering, so we have to find the matching tokenId
function getListing(listings, tokenId) {
  let listing = {};
  listings.every((_listing) => {
    if (_listing.tokenId == tokenId) {
      listing = _listing;
      return false;
    } else {
      return true;
    }
  });
  return listing
}

function listingToString(listing) {
  let listingCopy = { ...listing };
  listingCopy.tokenId = listing.tokenId.toString();
  listingCopy.pricePerDay = listing.pricePerDay.toString();
  listingCopy.startDateUNIX = listing.startDateUNIX.toString();
  listingCopy.endDateUNIX = listing.endDateUNIX.toString();
  listingCopy.expiryDate = listing.expiryDate.toString();
  if ("rentalFee" in listing) {
    listingCopy.rentalFee = listing.rentalFee.toString();
  }
}

contract(MARKETPLACE_CONTRACT_NAME, function (accounts) {
  const MARKETPLACE_OWNER = accounts[0];
  const TOKEN_OWNER = accounts[1];
  const RENTER = accounts[2];
  let marketplace;
  let rentableVehicles;
  let nftContract;

  before('should reuse variables', async () => {
    // Initialize contracts
    marketplace = await Marketplace.deployed();
    rentableVehicles = await RentableVehicles.deployed();
    nftContract = rentableVehicles.address;

    // Mint NFTs for testing
    await rentableVehicles.mint("fakeURI", { from: TOKEN_OWNER });
    await rentableVehicles.mint("fakeURI", { from: TOKEN_OWNER });
    await rentableVehicles.mint("fakeURI", { from: TOKEN_OWNER });
  });

  /**
   * Check if the NFT is listed after creating a new one
   * 
   */
  it("Should list NFT", async function () {
    let tracker = await balance.tracker(MARKETPLACE_OWNER);
    await tracker.get();
    let txn = await marketplace.listNFT(nftContract, 1, ether("1"), TOMORROW, IN_FIVE_DAYS, { from: TOKEN_OWNER });
    let expectedListing = {
      owner: TOKEN_OWNER,
      renter: constants.ZERO_ADDRESS,
      nftContract: nftContract,
      tokenId: 1,
      pricePerDay: ether("1"),
      startDateUNIX: TOMORROW,
      endDateUNIX: IN_FIVE_DAYS,
      expiryDate: 0
    };
    assertListing(getListing(await marketplace.getAllListings.call(), 1), expectedListing);
    expectEvent(txn, "NFTListed", listingToString(expectedListing));
    await tracker.get();
    txn = await marketplace.listNFT(nftContract, 2, ether(".5"), TOMORROW, IN_FIVE_DAYS, { from: TOKEN_OWNER });
    expectedListing.tokenId = 2;
    expectedListing.pricePerDay = ether(".5");
    expectedListing.startDateUNIX = TOMORROW;
    expectedListing.endDateUNIX = IN_FIVE_DAYS;
    expectedListing.expires = 0;
    assertListing(getListing(await marketplace.getAllListings.call(), 2), expectedListing);
    expectEvent(txn, "NFTListed", listingToString(expectedListing));
  });

  /**
   * Check if the NFT is validate after being added to the list
   * 
   */
  it("Should validate listings", async function () {
    /*
    await expectRevert(
      marketplace.listNFT(marketplace.address, 1, 1, TOMORROW, IN_FIVE_DAYS, { from: TOKEN_OWNER }),
      "The contract is not ERC4907 protocol."
    );
    */
    await expectRevert(
      marketplace.listNFT(nftContract, 1, 1, TOMORROW, IN_FIVE_DAYS, { from: accounts[2] }),
      "The following address is not the owner."
    );
    await expectRevert(
      marketplace.listNFT(nftContract, 1, 0, TOMORROW, IN_FIVE_DAYS, { from: TOKEN_OWNER }),
      "The rental price should be greater than zero."
    );
    await expectRevert(
      marketplace.listNFT(nftContract, 1, 1, YESTERDAY, IN_FIVE_DAYS, { from: TOKEN_OWNER }),
      "The beginning date cannot be in the past."
    );
    await expectRevert(
      marketplace.listNFT(nftContract, 1, 1, IN_FIVE_DAYS, YESTERDAY, { from: TOKEN_OWNER }),
      "The end date cannot be later than the beginning date."
    );
    await expectRevert(
      marketplace.listNFT(nftContract, 1, 1, TOMORROW, IN_FIVE_DAYS, { from: TOKEN_OWNER }),
      "This NFT was included on the list before."
    );
  });

  /**
   * Check if the NFT should be updated when it is listed
   * 
   */
  it("When an NFT is leased, the listings and contracts for the NFT should be updated", async function () {
    assertNFT(rentableVehicles, 1, constants.ZERO_ADDRESS, 0);
    assertNFT(rentableVehicles, 2, constants.ZERO_ADDRESS, 0);
    let tracker = await balance.tracker(TOKEN_OWNER);
    await tracker.get();
    let txn = await marketplace.rentNFT(nftContract, 1, TODAY_2, { from: RENTER, value: ether("1") });
    // 1 day rental, pricePerDay is 1
    assert.equal((await tracker.delta()).toString(), ether("1").toString(), "One day rental fee is not correct");
    let listing = getListing(await marketplace.getAllListings.call(), 1);
    let expectedListing = {
      owner: TOKEN_OWNER,
      renter: RENTER,
      nftContract: nftContract,
      tokenId: 1,
      pricePerDay: ether("1"),
      startDateUNIX: TOMORROW,
      endDateUNIX: IN_FIVE_DAYS,
      expiryDate: TODAY_2,
      rentalFee: 1
    };
    assertListing(listing, expectedListing);
    assertNFT(rentableVehicles, 1, RENTER, TODAY_2);
    expectEvent(txn, "NFTRented", listingToString(expectedListing));
    await tracker.get();
    txn = await marketplace.rentNFT(nftContract, 2, IN_FIVE_DAYS, { from: RENTER, value: ether("2.5") });
    assert.equal((await tracker.delta()).toString(), ether("2.5").toString(), "Five day rental fee is not correct");
    listing = getListing(await marketplace.getAllListings.call(), 2);
    expectedListing.tokenId = 2;
    expectedListing.pricePerDay = ether(".5");
    expectedListing.expiryDate = IN_FIVE_DAYS;
    expectedListing.rentalFee = ether("2.5");
    assertListing(listing, expectedListing);
    assertNFT(rentableVehicles, 2, RENTER, IN_FIVE_DAYS);
    expectEvent(txn, "NFTRented", listingToString(expectedListing));
  });

  /**
   * Check if the rent payment has been transferred successfully
   * 
   */
  it("Should verify rents", async function () {
    await expectRevert(
      marketplace.rentNFT(nftContract, 1, TODAY_2, { from: RENTER, value: ether("1") }),
      "NFT has already been rented."
    );
    await marketplace.listNFT(nftContract, 3, ether("1"), TOMORROW, IN_FIVE_DAYS, { from: TOKEN_OWNER });
    await expectRevert(
      marketplace.rentNFT(nftContract, 3, IN_FIVE_DAYS + 1000, { from: RENTER, value: ether("2.5") }),
      "The rental period exceeds the maximum date rentable."
    );
    await expectRevert(
      marketplace.rentNFT(nftContract, 3, TOMORROW, { from: RENTER }),
      "Could not proceed because there is not enough ETH in your wallet to cover rental period"
    );
  });

  /**
   * Check if unlist NFT functionality works
   * 
   */
  it("Should verify unlisting", async function () {
    await expectRevert(
      marketplace.unlistNFT(nftContract, 4, { from: TOKEN_OWNER, value: ether("2.5") }),
      "This NFT is not included in the list."
    );
    await expectRevert(
      marketplace.unlistNFT(nftContract, 2, { from: RENTER, value: ether("2.5") }),
      "The request to delist NFT was denied."
    );
    await expectRevert(
      marketplace.unlistNFT(nftContract, 2, { from: TOKEN_OWNER }),
      "Could not proceed refund because there is not enough ETH in your wallet"
    );
  });

  /**
   * Check if the refund for the renter returned and clean up listings 
   * only if the renter was not previously known.
   * 
   */
  it("Should reimburse the renter and clear up listings if the renter was unlisted", async function () {
    let tracker = await balance.tracker(RENTER);
    await tracker.get();
    let txn = await marketplace.unlistNFT(nftContract, 2, {from: TOKEN_OWNER, value: ether("2.5")});
    assert.equal((await tracker.delta()).toString(), ether("2.5"), "Refunded amount is not correct");
    let listing = getListing(await marketplace.getAllListings.call(), 2);
    assert.equal(Object.keys(listing).length, 0, "NFT was not unlisted");
    assertNFT(rentableVehicles, 2, constants.ZERO_ADDRESS, 0);
    expectEvent(txn, "NFTUnlisted", {
      unlistSender: TOKEN_OWNER,
      nftContract: nftContract,
      tokenId: "2",
      refund: ether("2.5")
    });
  });
});
