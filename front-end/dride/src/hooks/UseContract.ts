import { useContractFunction as _useContractFunction } from "@usedapp/core";
import { contract } from "./Contract";

export enum Access {
    addOwner = "addOwner",
    addRenter = "addRenter",
    isOwner = "isOwner",
    isRenter = "isRenter",
    removeOwner = "removeOwner",
    removeRenter = "removeRenter"
}

export enum Rental {
    addRentPeriod = "addRentPeriod",
    addInsurancePackage = "addInsurancePackage",
    verifyRentalProcess = "confirmation",
    completeRentalProcess  = "completion"
}

export enum Vehicle {
    addVehicle = "addVehicle",
    getVehiclesList = "vehicles",
    getVehicleByID = "getVehicleByID"
}

export const Contracts = {
    Access,
    Rental,
    Vehicle
};

const useContractFunction = (name: string) => {
    const { state, send } = _useContractFunction(contract, name);
    const loading = state.status === "PendingSignature" || state.status === "Mining";
    const success = state.status === "Success"
    const error = state.status === "Fail" || state.status === "Exception";

    return {
        loading, success, error, send
    };
};

export default useContractFunction;