// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "./Access.sol";

contract Rental is Access {

    /// Enumerations
    enum CarType {
        Hatchback,
        Sedan,
        SUV,
        MUV,
        Crossover,
        Coupe,
        Convertible
    }
    enum CarStatus {
        Available,
        Hired
    }

    /// Structures
    struct Coordinate {
        string latitude;
        string longitude;
    }
    struct Car {
        uint id;
        bytes32 name;
        bytes32 brand;
        CarType carType;
        Coordinate location;
        uint model;
        bytes32 image;
        uint rentCost;
        uint insuranceDeposit;
        uint timestamp;
        CarStatus status;
    }

    /// Variables
    uint public carCount = 0;

    mapping(uint => Car) public getCarByID;
    mapping(uint => Car[]) public cars;

    constructor() { }

    //// Modifiers

    /// @dev The following will check if the car does not exsist
    modifier carDoesNotExsists(bytes32 name) {
        require(getCarByID[carCount].name == name, "The following car has already been added.");
        _;
    }

    /// @dev The following will check if the car exsists
    modifier carExsists(uint id) {
        require(getCarByID[id].id != uint(0x0), "The following car could not be found in the mapping list.");
        _;
    }

    /// Functions

    /**
     * @dev The following function will be used to add Cars.
     *
     * Modifiers:
     *  - Restricted to members of the owner role.
     *  - Should not exist.
     */
    function addCar(bytes32 name, bytes32 brand, CarType carType, Coordinate memory location, uint model, bytes32 image, uint rentCost, uint insuranceDeposit) 
        public 
        onlyOwner carDoesNotExsists(name)
        returns (bool success)
    {
        carCount++;
        Car memory temporaryObj = Car(
            carCount,
            name,
            brand,
            carType,
            location,
            model,
            image,
            rentCost,
            insuranceDeposit,
            block.timestamp,
            CarStatus.Available
        );
        cars[carCount].push(temporaryObj);

        return cars[carCount].length != 0;
    }
}