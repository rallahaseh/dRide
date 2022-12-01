import { FC, useEffect, useMemo, useState } from 'react';
import router from 'next/router';
import { useAccount } from 'wagmi';
import { default as useSWRImmutable } from 'swr';
import { fetchAvailableNFTs, NFTItem } from '../api';
import {
    Box,
    CircularProgress,
    Grid,
    Typography
} from '@mui/material';
import { NFTCard } from '../../components';
import { ActionType } from '../../components/nft-card';
import { SearchResult } from './search';
// Contracts
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { contractConfigurations } from '../../hooks/contractConfigurations';
import { BigNumber } from 'ethers';
import { StateAlert, StateType } from '../../components/state';
import { signERC2612Permit } from 'eth-permit';

interface RequestParams {
    price: BigNumber
    tokenID: BigNumber
    startDate: BigNumber
    endDate: BigNumber
    deadline: BigNumber
    v: number
    r: string
    s: string
}

export const Vehicle: FC<VehicleProps> = (props: VehicleProps) => {
    const { result } = props;
    const { address } = useAccount();
    const { data, error, isValidating } = useSWRImmutable<NFTItem[]>({}, async () =>
        await fetchAvailableNFTs()
    );
    const filteredData = useMemo<NFTItem[] | null>(() => {
        if (result && data) {
            const filterResult = data.filter((nft) => {
                let fromDate = result.date.from! <= nft?.date?.from || result.date.from! <= nft?.date?.to
                let toDate = result.date.to! <= nft?.date?.to
                var location = true;
                if (result.location) {
                    // location &&= false;
                    // let searchLocation = whichCountry[searchResult.location.center[0], searchResult.location.center[1]]
                    // let nftLocation = whichCountry[nft.userLocation.latitude, nft.userLocation.longitude]
                }
                return fromDate && toDate && location;
            });
            return filterResult;
        } else {
            return null;
        }
    }, [data]);
    // Web3
    const [requestParams, setRequestParams] = useState<RequestParams>()
    // Rent an NFT
    const { config: rentNFTConfig } = usePrepareContractWrite({
        ...contractConfigurations.marketplace,
        functionName: 'rentNFT',
        args: [
            `0x${contractConfigurations.rentableVehicles.address.slice(2)}`,
            requestParams?.tokenID!,
            requestParams?.startDate!,
            requestParams?.endDate!,
            requestParams?.deadline!,
            requestParams?.v!,
            `0x${requestParams?.r.slice(2)}`,
            `0x${requestParams?.s.slice(2)}`,
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
        onError: () => {
            console.log("rentNFT - Error: ", rentNFTTransactionData);
        },
        onSuccess: () => {
            console.log("rentNFT - Success: ", rentNFTTransactionError);
            router.push('/')
        }
    });
    // Permit
    useEffect(() => {
        const callRequest = (async () => {
            await rentNFT?.({
                recklesslySetUnpreparedArgs: [
                    `0x${contractConfigurations.rentableVehicles.address.slice(2)}`,
                    requestParams?.tokenID!,
                    requestParams?.startDate!,
                    requestParams?.endDate!,
                    requestParams?.deadline!,
                    requestParams?.v!,
                    `0x${requestParams?.r.slice(2)}`,
                    `0x${requestParams?.s.slice(2)}`,
                ]
            })
        })
        callRequest()
    }, [requestParams])

    if (error) {
        return (
            <StateAlert state={StateType.error} />
        );
    }

    if (!data || isValidating || isRentNFTRequestLoading || isRentNFTTransactionLoading) {
        return (
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <CircularProgress size={200} />
                <Typography p={5} fontStyle="inherit" fontSize={35}>Loading...</Typography>
            </Box>
        );
    }

    if (filteredData?.length === 0) {
        return (
            <StateAlert state={StateType.empty} />
        );
    }

    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {filteredData?.map((item) => (
                item &&
                <Grid item xs={2} sm={4} md={4} key={item.tokenId}>
                    <NFTCard
                        key={item.tokenId}
                        item={item}
                        action={ActionType.rent}
                        rentSelectionHandler={async () => {
                            let startDate = result?.date.from!
                            let expiryDate = result?.date.to!
                            const numDays = (expiryDate - startDate) / 60 / 60 / 24
                            const amount = BigNumber.from(item.price).mul(numDays)
                            // ERC2612 Permit
                            if (!address) { return }
                            const transactionValue = BigNumber.from(amount).mul(10 ** 6).toNumber()
                            const transactionDeadline = Date.now() + 20 * 60;
                            const permitResult = await signERC2612Permit(
                                window.ethereum,
                                contractConfigurations.tokens.usdc.address,
                                address,
                                contractConfigurations.marketplace.address,
                                transactionValue,
                                transactionDeadline
                            );
                            setRequestParams({
                                tokenID: BigNumber.from(item.tokenId),
                                price: amount,
                                startDate: BigNumber.from(startDate),
                                endDate: BigNumber.from(expiryDate),
                                deadline: BigNumber.from(permitResult.deadline),
                                v: permitResult.v,
                                r: permitResult.r,
                                s: permitResult.s
                            })
                        }}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

interface VehicleProps {
    result?: SearchResult
}
