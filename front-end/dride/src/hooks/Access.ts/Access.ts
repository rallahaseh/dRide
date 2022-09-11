import { useContractFunction } from "@usedapp/core"
import { contract } from "../Contract"

// Create
export const useAddOwner = () => {
    const { state, send } = useContractFunction(contract, "addOwner");
    const loading = state.status === "PendingSignature" || state.status === "Mining";
    const success = state.status === "Success"
    const error = state.status === "Fail" || state.status === "Exception";

    return {
        loading, success, error, send
    }
}

export const useAddRenter= () => {
    const { state, send } = useContractFunction(contract, "addRenter");
    const loading = state.status === "PendingSignature" || state.status === "Mining";
    const success = state.status === "Success"
    const error = state.status === "Fail" || state.status === "Exception";

    return {
        loading, success, error, send
    }
}

// Read
export const useIsOwner= () => {
    const { state, send } = useContractFunction(contract, "isOwner");
    const loading = state.status === "PendingSignature" || state.status === "Mining";
    const success = state.status === "Success"
    const error = state.status === "Fail" || state.status === "Exception";

    return {
        loading, success, error, send
    }
}

export const useIsRenter= () => {
    const { state, send } = useContractFunction(contract, "isRenter");
    const loading = state.status === "PendingSignature" || state.status === "Mining";
    const success = state.status === "Success"
    const error = state.status === "Fail" || state.status === "Exception";

    return {
        loading, success, error, send
    }
}

// Remove
export const useRemoveOwner = () => {
    const { state, send } = useContractFunction(contract, "removeOwner");
    const loading = state.status === "PendingSignature" || state.status === "Mining";
    const success = state.status === "Success"
    const error = state.status === "Fail" || state.status === "Exception";

    return {
        loading, success, error, send
    }
}

export const useRemoveRenter = () => {
    const { state, send } = useContractFunction(contract, "removeRenter");
    const loading = state.status === "PendingSignature" || state.status === "Mining";
    const success = state.status === "Success"
    const error = state.status === "Fail" || state.status === "Exception";

    return {
        loading, success, error, send
    }
}