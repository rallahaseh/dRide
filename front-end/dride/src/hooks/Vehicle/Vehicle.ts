import { useContractFunction } from "@usedapp/core"
import { contract } from "../Contract"

export const useAddVehicle = () => {
    const { state, send } = useContractFunction(contract, "addVehicle");
    const loading = state.status === "PendingSignature" || state.status === "Mining";
    const success = state.status === "Success"
    const error = state.status === "Fail" || state.status === "Exception";

    return {
        loading, success, error, send
    }
}

export const useGetVehiclesList = () => {
    const { state, send } = useContractFunction(contract, "vehicles");
    const loading = state.status === "PendingSignature" || state.status === "Mining";
    const success = state.status === "Success"
    const error = state.status === "Fail" || state.status === "Exception";

    return {
        loading, success, error, send
    }
}

export const useGetVehicleById = () => {
    const { state, send } = useContractFunction(contract, "getVehicleByID");
    const loading = state.status === "PendingSignature" || state.status === "Mining";
    const success = state.status === "Success"
    const error = state.status === "Fail" || state.status === "Exception";

    return {
        loading, success, error, send
    }
}