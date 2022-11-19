const RentableVehicles = artifacts.require("RentableVehicles");
const Marketplace = artifacts.require("Marketplace");

module.exports = async function (deployer) {
  await deployer.deploy(Marketplace, "0x07865c6E87B9F70255377e024ace6630C1Eaa37F", 5);
  const marketplace = await Marketplace.deployed();
  await deployer.deploy(RentableVehicles, marketplace.address);
};
