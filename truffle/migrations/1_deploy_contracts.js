const RentableVehicles = artifacts.require("RentableVehicles");
const Marketplace = artifacts.require("Marketplace");

module.exports = async function (deployer) {
  await deployer.deploy(Marketplace);
  const marketplace = await Marketplace.deployed();
  await deployer.deploy(RentableVehicles, marketplace.address);
};
