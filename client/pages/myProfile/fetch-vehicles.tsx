import type { FC } from 'react';
import { default as useSWR } from 'swr';
import { useAccount } from 'wagmi';
import { fetchMintedNFTsBy, fetchRentedNFTsBy, NFTItem } from '../api';
import { QueryType } from '../api/nft/fetchNFT';
import { NFTCard } from '../../components';
import { CircularProgress, Typography, Grid } from '@mui/material';
import { ActionType } from '../../components/nft-card';

export const Vehicles: FC<VehicleProps> = (props: VehicleProps) => {
    const { queryType } = props;

    const { address } = useAccount();
    const { data, error, isValidating } = useSWR<NFTItem[]>(address, async () =>
        (queryType == QueryType.owned) ? await fetchMintedNFTsBy(address) : await fetchRentedNFTsBy(address)
    );

    if (error) {
        return (
            <Typography variant="h1" gutterBottom>
                An error has occurred.
            </Typography>
        );
    }

    if (!data || isValidating) return <CircularProgress />;

    if (data.length === 0) {
        return (
            <Typography variant="h1" gutterBottom>
                No Data.
            </Typography>
        );
    }

    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {data.map((item) => (
                item &&
                <Grid item xs={2} sm={4} md={4} key={item.tokenID}>
                    <NFTCard key={item.tokenID} item={item} action={queryType == QueryType.owned ? ActionType.none : ActionType.unsubscribe} />
                </Grid>
            ))}
        </Grid>
    );
};

interface VehicleProps { queryType: QueryType }
