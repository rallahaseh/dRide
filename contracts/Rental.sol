// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "./Access.sol";

contract Rental is Access {

    /// Enumerations
    enum VehicleType {
        Hatchback,
        Sedan,
        SUV,
        MUV,
        Crossover,
        Coupe,
        Convertible
    }
    enum VehicleStatus {
        Available,
        Hired
    }
    enum ContractStatus {
        Initiated,
        InProgress,
        Completed
    }

    /// Structures
    struct Coordinate {
        bytes latitude;
        bytes longitude;
    }
    struct Vehicle {
        uint id;
        bytes32 name;
        bytes32 brand;
        VehicleType vehicleType;
        Coordinate location;
        uint model;
        bytes32 image;
        uint rentCost;
        VehicleStatus status;
    }
    struct Period {
        bytes32 from;
        bytes32 to;
    }
    struct Contract {
        address id;
        Vehicle selectedVehicle;
        Period period;
        uint totalCost;
        uint insuranceDeposit;
        uint dateOfIssuance;
        ContractStatus status;
    }

    /// Variables
    uint public vehicleCount = 0;
    uint public contractCount = 0;

    mapping(uint => Vehicle) public getVehicleByID;
    Vehicle[] public vehicles;
    mapping(uint => Contract) public getContractByID;
    Contract[] public contracts;

    constructor() { }

    //// Modifiers

    /// @dev The following will check if the vehicle does not exsist
    modifier vehicleDoesNotExsists() {
        require(vehicles.length < vehicleCount+1, "The following vehicle has already been added.");
        _;
    }

    /// @dev The following will check if the vehicle exsists
    modifier vehicleExsists(uint id) {
        require(getVehicleByID[id].id > uint(0x0), "The following vehicle could not be found in the mapping list.");
        _;
    }

    // The following will check whether the car is hired or not.
    modifier isVehicleAvailable(uint id){
        require(getVehicleByID[id].status == VehicleStatus.Available, "The selected vehicle is currently not available.");
        _;
    }

    /// @dev The following will check if the contract does not exsist
    modifier contractDoesNotExsists() {
        require(contracts.length < contractCount+1, "The following contract has already been added.");
        _;
    }

    /// @dev The following will check if the vehicle exsists
    modifier contractExsists(uint id) {
        require(getContractByID[id].id != address(0x0), "The following contract could not be found in the mapping list.");
        _;
    }

    /// @dev The following will check whether the renter has enough ETH in the wallet to pay the rent
    modifier enoughBalanceForConfirmation(uint id) {
        uint totalAmount = getContractByID[id].insuranceDeposit + getContractByID[id].totalCost;
        require(sender.balance >= totalAmount, "Could not proceed because there is not enough ETH in your wallet");
        _;
    }

    modifier enoughBalanceForCompletion(uint id) {
        uint totalAmount = getContractByID[id].insuranceDeposit;
        require(address(this).balance >= totalAmount, "Could not proceed because there is not enough ETH in your wallet");
        _;
    }

    /// Functions

    /**
     * @dev The following function will be used to add Vehicles.
     *
     * Modifiers:
     *  - Restricted to members of the owner role.
     *  - Should not exist.
     */
    function addVehicle(bytes32 name, bytes32 brand, VehicleType vehicleType, Coordinate memory location, uint model, bytes32 image, uint rentCost) 
        public 
        onlyOwner vehicleDoesNotExsists
        returns (bool success)
    {
        vehicleCount++;
        Vehicle memory temporaryObj = Vehicle(
            vehicleCount,
            name,
            brand,
            vehicleType,
            location,
            model,
            image,
            rentCost,
            VehicleStatus.Available
        );
        getVehicleByID[vehicleCount] = temporaryObj;
        vehicles.push(temporaryObj);

        return vehicles.length == vehicleCount;
    }

    /**
     * @dev The following function will be used to add the rent period to the selected vehicle.
     *
     * Modifiers:
     *  - Restricted to members of the renter role.
     *  - The selected vehicle should exist.
     */
    function addRentPeriod(uint carId, Period memory period, uint dayscount) 
        public
        onlyRenter vehicleExsists(carId) contractDoesNotExsists
        returns (bool success)
    {
        contractCount++;
        uint feeAmount = getVehicleByID[carId].rentCost * dayscount;
        Contract memory temporaryObj = Contract(
            msg.sender,
            getVehicleByID[carId],
            period,
            feeAmount,
            0,
            block.timestamp,
            ContractStatus.Initiated
        );
        getContractByID[contractCount] = temporaryObj;
        contracts.push(temporaryObj);

        return contracts.length == contractCount;
    }
    
    /**
     * @dev The following function will be used to add insurance package to the selected vehicle.
     *
     * Modifiers:
     *  - Restricted to members of the renter role.
     *  - The selected vehicle should be available.
     *  - The selected contract should exist.
     */
    function addInsurancePackage(uint carId, uint contractId, uint insuranceDeposit)
        public
        onlyRenter isVehicleAvailable(carId) contractExsists(contractId)
        returns (bool success)
    {
        getContractByID[contractId].insuranceDeposit = insuranceDeposit;

        return contracts.length == contractCount;
    }

    /** 
     * @dev The following function will be used for the selected vehicle and its options (sign contract).
     *  It will include the payment process also.
     *
     * Modifiers:
     *  - Restricted to members of the renter role.
     *  - The selected vehicle should exist.
     *  - The selected vehicle should be available.
     *  - The selected contract should exist.
     *  - The balance of ETH in the billing account wallet should be sufficient.
     */
    function confirmation(uint contractId, uint carId) 
        public payable
        onlyRenter vehicleExsists(carId) isVehicleAvailable(carId) contractExsists(contractId) enoughBalanceForConfirmation(contractId)
        returns (bool success)
    {
        // Update statuses
        getContractByID[contractId].status = ContractStatus.InProgress;
        getVehicleByID[carId].status = VehicleStatus.Hired;
        // Payment process
        uint totalAmount = getContractByID[contractId].totalCost + getContractByID[contractId].insuranceDeposit;
        this.paymentProcess(totalAmount);

        return contracts.length == contractCount;
    }

    /** 
     * @dev The following function will be used to complete the ride and return insurrance money.
     *
     * Modifiers:
     *  - Restricted to members of the renter role.
     *  - The selected vehicle should exist.
     *  - The selected contract should exist.
     *  - The balance of ETH in the billing account wallet should be sufficient.
     */
    function completion(uint contractId, uint carId) 
        public payable
        onlyRenter vehicleExsists(carId) contractExsists(contractId) enoughBalanceForCompletion(contractId)
        returns (bool success)
    {
        // Update statuses
        getContractByID[contractId].status = ContractStatus.Completed;
        getVehicleByID[carId].status = VehicleStatus.Available;
        // Payment process
        uint insuranceDeposit = getContractByID[contractId].insuranceDeposit;
        address payable recipient = payable(msg.sender);
        (bool sent, ) = recipient.call{value: insuranceDeposit}("");
        require(sent, "Failed to send Ether");
        
        return contracts.length == contractCount;
    }

    /** 
     * @dev The following function will be used to send ETH from wallet to smart contract.
     */
    function paymentProcess(uint256) public payable {}
}