import { FC } from 'react';
import { NFTItem } from '../pages/api';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export const NFTCard: FC<NFTCardProps> = (props: NFTCardProps) => {
    const { item, rentable } = props;
    const handleRentClick = () => {

    };

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader
                title={item.vehicle.brand + " - " + item.vehicle.model}
                subheader={"Year: " + item.vehicle.year + ", Type: " + item.vehicle.type}
            />
            <CardMedia
                component="img"
                src={`https://nftstorage.link/ipfs/${item.ipfsCID}/${item.thumbnail.name}`}
                alt={item.thumbnail.originalName}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {item.userLocation.name}
                </Typography>
                <Typography variant="h6" color="text.primary">
                    Price
                </Typography>
                <Typography variant="body2" color="text.primary">
                    {item.price + " €/day"}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleRentClick}
                    disabled={rentable}
                >
                    Rent
                </Button>
            </CardActions>
        </Card>
    );
};

interface NFTCardProps {
    item: NFTItem;
    rentable?: boolean;
}
