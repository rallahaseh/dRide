import { FC, useEffect, useState, useMemo } from 'react';
import { Box, CircularProgress, Typography, Grid } from '@mui/material';
import { NFTCard } from '../../components';
import { ActionType } from '../../components/nft-card';
import { StateAlert, StateType } from '../../components/state';
// Web3
import { default as useSWRImmutable } from 'swr';
import { useAccount } from 'wagmi';
import { fetchUserNFTs, UserData, NFTItem } from '../api';
import { QueryType } from '../api/nft/fetchNFT';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { contractConfigurations } from '../../hooks/contractConfigurations';
import { BigNumber } from 'ethers';

export const Vehicles: FC<VehicleProps> = (props: VehicleProps) => {
    const { queryType } = props;

    const [tokenID, setTokenID] = useState<BigNumber>();
    const { address } = useAccount();
    const { data, error, isValidating } = useSWRImmutable<UserData>(address, async () =>
        await fetchUserNFTs(address)
    );
    const filteredData = useMemo<NFTItem[] | null>(() => {
        if (data) {
            if (queryType == QueryType.listed) {
                return data.listedTokens
            } else {
                return data.rentedTokens
            }
        } else {
            return null
        }
    }, [data]);

    // Web3
    // Unlist an NFT
    const { config: unlistNFTConfig } = usePrepareContractWrite({
        ...contractConfigurations.marketplace,
        functionName: 'unlistNFT',
        args: [
            `0x${contractConfigurations.rentableVehicles.address.slice(2)}`,
            tokenID!
        ]
    });
    const {
        data: unlistNFTRequestData,
        writeAsync: unlistNFT,
        isLoading: isUnlistNFTRequestLoading,
        isSuccess: isUnlistNFTRequestStarted,
        error: unlistNFTRequestError,
    } = useContractWrite(unlistNFTConfig);
    const {
        data: unlistNFTTransactionData,
        error: unlistNFTTransactionError,
        isLoading: isUnlistNFTTransactionLoading
    } = useWaitForTransaction({
        hash: unlistNFTRequestData?.hash,
        onError: () => {
            console.log("unlistNFT - Error: ", unlistNFTTransactionData);
        },
        onSuccess: () => {
            console.log("unlistNFT - Success: ", unlistNFTTransactionError);
        }
    });

    useEffect(() => {
        const callRequest = async () => {
            await unlistNFT?.({
                recklesslySetUnpreparedArgs: [
                    `0x${contractConfigurations.rentableVehicles.address.slice(2)}`,
                    tokenID!
                ]
            })
        }
        if (!tokenID) return;
        callRequest()
            .catch(console.log)
    }, [tokenID])

    if (error) {
        return (
            <StateAlert state={StateType.error} />
        );
    }

    if (!data || isValidating || isUnlistNFTRequestLoading || isUnlistNFTTransactionLoading) {
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
                <Grid item xs={2} sm={4} md={4} key={item.tokenID}>
                    <NFTCard
                        key={item.tokenID}
                        item={item}
                        action={queryType == QueryType.listed ? ActionType.unlist : ActionType.none}
                        unlistSelectionHandler={async () => {
                            const _tokenID = BigNumber.from(item.tokenID)
                            setTokenID(_tokenID);
                        }}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

interface VehicleProps { queryType: QueryType }
