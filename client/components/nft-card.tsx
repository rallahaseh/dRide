import { FC, useState } from 'react';
import { NFTItem } from '../pages/api';
import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button

} from '@mui/material';
import { AlertDialog } from '.';

export const NFTCard: FC<NFTCardProps> = (props: NFTCardProps) => {
    const [showAlert, setShowAlert] = useState<Boolean>(false);
    // Props
    const { item, action } = props;
    let fromDate = new Date(item.date?.from * 1000);
    let toDate = new Date(item.date?.to * 1000);

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
                if (!props.rentSelectionHandler) return;
                props?.rentSelectionHandler();
            }
            case ActionType.unlist: {
                if (!props.unlistSelectionHandler) return;
                props?.unlistSelectionHandler();
            }
        }
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    return (
        <>
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
                showAlert && action == ActionType.unlist &&
                <AlertDialog
                    title='Return Vehicle'
                    description='Are you sure you want to unlist this vehicle?'
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
                    image={`https://nftstorage.link/ipfs/${item.tokenURI}/${item.thumbnail.name}`}
                    alt="nft-thumbnail"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {item.price + " $/day"}
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
                        action == ActionType.unlist &&
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
    unlist,
    none
}

interface NFTCardProps {
    item: NFTItem;
    action: ActionType;

    rentSelectionHandler?: () => void
    unlistSelectionHandler?: () => void
}
