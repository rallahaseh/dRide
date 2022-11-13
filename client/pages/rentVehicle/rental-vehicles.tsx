import { FC, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { default as useSWR } from 'swr';
import { fetchAvailableNFTs, NFTItem } from '../api';
import {
    CircularProgress,
    Grid,
    Typography
} from '@mui/material';
import { NFTCard } from '../../components';
import { ActionType } from '../../components/nft-card';
import { SearchResult } from './search';

export const Vehicle: FC<VehicleProps> = (props: VehicleProps) => {
    const { result } = props;
    const { address } = useAccount();
    const { data, error, isValidating } = useSWR<NFTItem[]>(address, async () =>
        await fetchAvailableNFTs(address)
    );
    const filteredData = useMemo<NFTItem[] | null>(() => {
        if (result && data) {
            const filterResult = data.filter((nft) => {
                let fromDate = result.date.from! <= nft?.date?.from
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

    if (error) {
        return (
            <Typography variant="h1" gutterBottom>
                An error has occurred.
            </Typography>
        );
    }

    if (!data || isValidating) return <CircularProgress />;

    if (filteredData?.length === 0) {
        return (
            <Typography variant="h1" gutterBottom>
                No Data.
            </Typography>
        );
    }

    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {filteredData?.map((item) => (
                item &&
                <Grid item xs={2} sm={4} md={4} key={item.tokenID}>
                    <NFTCard key={item.tokenID} item={item} action={ActionType.rent} />
                </Grid>
            ))}
        </Grid>
    );
};

interface VehicleProps {
    result?: SearchResult
}
