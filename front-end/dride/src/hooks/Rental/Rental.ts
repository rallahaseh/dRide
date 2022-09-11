import { useContractFunction } from "@usedapp/core"
import { contract } from "../Contract"

export const useAddRentPeriod = () => {
    const { state, send } = useContractFunction(contract, "addRentPeriod");
    const loading = state.status === "PendingSignature" || state.status === "Mining";
    const success = state.status === "Success"
    const error = state.status === "Fail" || state.status === "Exception";

    return {
        loading, success, error, send
    }
}

export const useAddInsurancePackage = () => {
    const { state, send } = useContractFunction(contract, "addInsurancePackage");
    const loading = state.status === "PendingSignature" || state.status === "Mining";
    const success = state.status === "Success"
    const error = state.status === "Fail" || state.status === "Exception";

    return {
        loading, success, error, send
    }
}

export const useVerifyRentalProcess = () => {
    const { state, send } = useContractFunction(contract, "confirmation");
    const loading = state.status === "PendingSignature" || state.status === "Mining";
    const success = state.status === "Success"
    const error = state.status === "Fail" || state.status === "Exception";

    return {
        loading, success, error, send
    }
}

export const useCompleteRentalProcess  = () => {
    const { state, send } = useContractFunction(contract, "completion");
    const loading = state.status === "PendingSignature" || state.status === "Mining";
    const success = state.status === "Success"
    const error = state.status === "Fail" || state.status === "Exception";

    return {
        loading, success, error, send
    }
}