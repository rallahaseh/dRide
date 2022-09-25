const RentableVehicles = artifacts.require("RentableVehicles");
const Warehouse = artifacts.require("Warehouse");

module.exports = async function (deployer) {
  await deployer.deploy(Warehouse);
  const warehouse = await Warehouse.deployed();
  await deployer.deploy(RentableVehicles, warehouse.address);
};
