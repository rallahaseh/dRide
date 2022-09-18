const RentableVehicles = artifacts.require("RentableVehicles");

module.exports = function (deployer) {
  deployer.deploy(RentableVehicles);
};
