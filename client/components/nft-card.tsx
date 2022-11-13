import { FC, useState } from 'react';
import { NFTItem } from '../pages/api';
import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    CircularProgress

} from '@mui/material';
import { AlertDialog } from '.';
// Web3
import { useContractFunctions } from '../hooks/useContractFunctions';
import { BigNumber } from 'ethers';

export const NFTCard: FC<NFTCardProps> = (props: NFTCardProps) => {
    const [showAlert, setShowAlert] = useState<Boolean>(false);
    // Props
    const { item, action } = props;
    let fromDate = new Date(item.date?.from * 1000);
    let toDate = new Date(item.date?.to * 1000);
    // Web3
    const { rent, unlist, isLoading, onSuccess, onFailure, failure } = useContractFunctions(
        BigNumber.from(item?.tokenID),
        BigNumber.from(item?.date?.from),
        BigNumber.from(item?.date?.to)
    )

    const handleRentClick = () => {
        setShowAlert(true);
    };

    const handleReturnVehicleClick = () => {
        setShowAlert(true);
    };

    const handleAlertAction = async () => {
        setShowAlert(false);
        switch (action) {
            case ActionType.rent: {
                await rent();
            }
            case ActionType.unsubscribe: {
                await unlist();
            }
        }
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    if (isLoading) {
        return (
            <CircularProgress
                color="primary"
                size="lg"
                value={50}
                variant="determinate"
            />
        );
    }

    return (
        <>
            {
                showAlert && onFailure &&
                <AlertDialog
                    title='Error'
                    description={failure}
                    primaryActionTitle='Yes'
                    primaryAction={handleAlertAction}
                    secondaryActionTitle='Cancel'
                    secondaryAction={handleCloseAlert}
                />
            }
            {
                showAlert && action == ActionType.rent &&
                <AlertDialog
                    title='Rent Vehicle'
                    description='Are you sure you want to rent this vehicle?'
                    primaryActionTitle='Yes'
                    primaryAction={handleAlertAction}
                    secondaryActionTitle='Cancel'
                    secondaryAction={handleCloseAlert}
                />
            }
            {
                showAlert && action == ActionType.unsubscribe &&
                <AlertDialog
                    title='Return Vehicle'
                    description='Are you sure you want to return this vehicle?'
                    primaryActionTitle='Yes'
                    primaryAction={handleAlertAction}
                    secondaryActionTitle='Cancel'
                    secondaryAction={handleCloseAlert}
                />
            }
            <Card sx={{ maxWidth: 345 }}>
                <CardHeader
                    title={item.vehicle.brand + " - " + item.vehicle.model}
                    subheader={"Year: " + item.vehicle.year + ", Type: " + item.vehicle.type}
                />
                <CardMedia
                    component="img"
                    height="250"
                    image={`https://nftstorage.link/ipfs/${item.ipfsCID}/${item.thumbnail.name}`}
                    alt="nft-thumbnail"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {item.price + " €/day"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {`Available Until: ${toDate?.toDateString()}`}
                    </Typography>
                </CardContent>
                <CardActions>
                    {
                        action == ActionType.rent &&
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleRentClick}
                        >
                            Rent
                        </Button>
                    }
                    {
                        action == ActionType.unsubscribe &&
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleReturnVehicleClick}
                        >
                            Return Vehicle
                        </Button>
                    }
                </CardActions>
            </Card>
        </>
    );
};

export enum ActionType {
    rent,
    unsubscribe,
    none
}

interface NFTCardProps {
    item: NFTItem;
    action: ActionType;
}
