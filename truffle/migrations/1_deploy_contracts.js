const RentableVehicles = artifacts.require("RentableVehicles");
const Marketplace = artifacts.require("Marketplace");

module.exports = async function (deployer) {
  const usdcAddress = "0xaF7f7d3bC41dc0ab220De52B91ebeB5D48E9f4c7";
  const feeRate = 10;
  await deployer.deploy(Marketplace, usdcAddress, feeRate);
  const marketplace = await Marketplace.deployed();
  await deployer.deploy(RentableVehicles, marketplace.address);
};
