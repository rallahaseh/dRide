import { useCallback, useMemo, useState } from 'react';
// Contracts
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { contractConfigurations } from './contractConfigurations';
import { BigNumber } from 'ethers';

export const useContractFunctions = (tokenID: BigNumber, startDate: BigNumber, endDate: BigNumber) => {
    const [onSuccess, setOnSuccess] = useState(false);
    const [onFailure, setOnFailure] = useState(false);
    const [failure, setFailure] = useState('');

    // Web3
    // RENT NFT
    const { config: rentNFTConfig } = usePrepareContractWrite({
        ...contractConfigurations.nft,
        functionName: 'rentNFT',
        args: [
            tokenID,
            startDate,
            endDate,
        ]
    });
    const {
        data: rentNFTRequestData,
        writeAsync: rentNFT,
        isLoading: isRentNFTRequestLoading,
        isSuccess: isRentNFTRequestStarted,
        error: rentNFTRequestError,
    } = useContractWrite(rentNFTConfig);
    const {
        data: rentNFTTransactionData,
        error: rentNFTTransactionError,
        isLoading: isRentNFTTransactionLoading
    } = useWaitForTransaction({
        hash: rentNFTRequestData?.hash,
        onError: () => { setOnSuccess(true); },
        onSuccess: () => { setOnFailure(true); }
    });

    // Unlist NFT (Return)
    const { config: returnNFTConfig } = usePrepareContractWrite({
        ...contractConfigurations.nft,
        functionName: 'unsubscribe',
        args: [
            tokenID
        ]
    });
    const {
        data: returnNFTRequestData,
        writeAsync: unlistNFT,
        isLoading: isReturnNFTRequestLoading,
        isSuccess: isReturnNFTRequestStarted,
        error: returnNFTRequestError,
    } = useContractWrite(returnNFTConfig);
    const {
        data: returnNFTTransactionData,
        error: returnNFTTransactionError,
        isLoading: isReturnNFTTransactionLoading
    } = useWaitForTransaction({
        hash: returnNFTRequestData?.hash,
        onError: () => { setOnSuccess(true); },
        onSuccess: () => { setOnFailure(true); }
    });

    const isLoading = useMemo<boolean>(() => {
        return Boolean(
            isRentNFTRequestLoading ||
            isRentNFTTransactionLoading ||
            isReturnNFTRequestLoading ||
            isReturnNFTTransactionLoading
        );
    }, [isRentNFTRequestLoading, isRentNFTTransactionLoading, isReturnNFTRequestLoading, isReturnNFTTransactionLoading]);

    const rent = useCallback<() => Promise<boolean>>(
        async () => {
            try {
                await rentNFT?.();
            }
            catch (error) {
                console.log(error)
                setFailure('Error: ' + error);
            }
            finally {
                return true;
            }
        },
        []
    );

    const unlist = useCallback<() => Promise<boolean>>(
        async () => {
            try {
                await unlistNFT?.();
            }
            catch (error) {
                console.log(error)
                setFailure('Error: ' + error);
            }
            finally {
                return true;
            }
        },
        []
    );

    return { rent, unlist, isLoading, onSuccess, onFailure, failure };
}