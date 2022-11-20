import { FC, useState } from 'react';
// MUI Components
import {
    Box,
    Grid,
    FormControlLabel,
    Checkbox,
    Button,
    CircularProgress,
    Typography
} from '@mui/material';
// Contracts
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { contractConfigurations } from '../../hooks/contractConfigurations';
import { VehicleData } from './mint';

interface ListVehicleProps {
    metadata: VehicleData
    onComplete: () => void
}

const ListVehicle: FC<ListVehicleProps> = (props: ListVehicleProps) => {
    const nftContract = `0x2EE2807276ee3B715071cdC22BcF2e0E78FD9Bfb`;
    const [checked, setChecked] = useState(false);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    // Web3
    // List an NFT
    const { config: listNFTConfig } = usePrepareContractWrite({
        ...contractConfigurations.marketplace,
        functionName: 'listNFT',
        args: [
            nftContract,
            props.metadata.tokenID!,
            props.metadata.pricePerDay!,
            props.metadata.startDate!,
            props.metadata.endDate!,
        ]
    });
    const {
        data: listNFTRequestData,
        writeAsync: listNFT,
        isLoading: isListNFTRequestLoading,
        isSuccess: isListNFTRequestStarted,
        error: listNFTRequestError,
    } = useContractWrite(listNFTConfig);
    const {
        data: listNFTTransactionData,
        error: listNFTTransactionError,
        isLoading: isListNFTTransactionLoading
    } = useWaitForTransaction({
        hash: listNFTRequestData?.hash,
        onError: () => { console.log("listNFT - Error: ", listNFTTransactionData); },
        onSuccess: () => {
            console.log("listNFT - Success: ", listNFTTransactionError);
            props.onComplete();
        }
    });

    const onClickHanlder = async () => {
        await listNFT?.();
    }

    if (isListNFTRequestLoading || isListNFTTransactionLoading) {
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
    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <Grid item xs={12}>
                <FormControlLabel
                    label="Do you agree to add your vehicle to the list?"
                    control={
                        <Checkbox
                            checked={checked}
                            onChange={handleChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    }
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    disabled={!checked}
                    onClick={onClickHanlder}
                >
                    Add to list
                </Button>
            </Grid>
        </Box>
    );
}

export default ListVehicle;