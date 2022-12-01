import { FC, Fragment, useState } from 'react';
// MUI Components
import {
    Box,
    Grid,
    FormControlLabel,
    Checkbox,
    Button,
    CircularProgress,
    Typography,
    Backdrop,
    Alert
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
    const [checked, setChecked] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };
    const handleToggleBackdrop = () => {
        setOpenBackdrop(!openBackdrop);
    };
    const handleClosePage = () => {
        setOpenBackdrop(false);
        props.onComplete();
    }

    // Web3
    // List an NFT
    const { config: listNFTConfig } = usePrepareContractWrite({
        ...contractConfigurations.marketplace,
        functionName: 'listNFT',
        args: [
            `0x${contractConfigurations.rentableVehicles.address.slice(2)}`,
            props.metadata.tokenID!,
            props.metadata.pricePerDay!,
            props.metadata.startDate.add(10 * 60),
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
        onError: () => {
            console.log("listNFT - Error: ", listNFTTransactionData);
            handleToggleBackdrop();
        },
        onSuccess: () => {
            console.log("listNFT - Success: ", listNFTTransactionError);
            handleToggleBackdrop();
        }
    });

    const onMintClickHanlder = async () => {
        setOpenBackdrop(false);
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
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                {listNFTTransactionError &&
                    <Grid container spacing={2} md={8} alignContent="center" justifyContent="center">
                        <Grid item xs={16} md={8}>
                            <Alert severity="error">An error has occurred, please try again</Alert>
                        </Grid>
                        <Grid item xs={16} md={8}>
                            <Button onClick={onMintClickHanlder} color="error">Try again</Button>
                        </Grid>
                    </Grid>
                }
                {listNFTTransactionData &&
                    <>
                        <Alert severity="success">Your vehicle Has been added successfully!</Alert>
                        <Button onClick={handleClosePage} color="success">Done</Button>
                    </>
                }
            </Backdrop>
            {!openBackdrop &&
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
                            onClick={onMintClickHanlder}
                        >
                            Add to list
                        </Button>
                    </Grid>
                </Box>
            }
        </>
    );
}

export default ListVehicle;