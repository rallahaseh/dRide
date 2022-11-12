import { Fragment } from 'react';
import { default as useSWR } from 'swr';
import type { FC } from 'react';
import { NFTItem } from '../api';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { NFTCard } from '../../components';


export const Vehicle: FC<VehicleProps> = (props: VehicleProps) => {
    const { } = props;

    const { data, error } = useSWR<NFTItem[]>('allnfts');

    if (error) {
        return (
            <Typography variant="h1" gutterBottom>
                An error has occurred.
            </Typography>
        );
    }

    if (!data) return <CircularProgress />;

    if (data.length === 0) {
        return (
            <Typography variant="h1" gutterBottom>
                No Data.
            </Typography>
        );
    }

    return (
        <Fragment>
            {data.map((item) => (
                <NFTCard key={item.tokenID} item={item} />
            ))}
        </Fragment>
    );
};

interface VehicleProps { }
