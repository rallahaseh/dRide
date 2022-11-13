import { FC } from 'react';
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

export const NFTCard: FC<NFTCardProps> = (props: NFTCardProps) => {
    const { item, action } = props;
    let fromDate = new Date(item.date?.from * 1000);
    let toDate = new Date(item.date?.to * 1000);

    const handleRentClick = () => {

    };

    const handleReturnVehicleClick = () => {

    };

    return (
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
