import { Fragment } from 'react';
import type { FC } from 'react';
import { default as useSWR } from 'swr';
import { useAccount } from 'wagmi';
import { fetchNFTsBy, NFTItem } from '../api';
import { QueryType } from '../api/nft/fetchNFT';
import { NFTCard } from '../../components';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { ActionType } from '../../components/nft-card';

export const Vehicles: FC<VehicleProps> = (props: VehicleProps) => {
    const { } = props;

    const { address } = useAccount();
    const { data, error } = useSWR<NFTItem[]>(address, async () => await fetchNFTsBy(props.queryType, address));

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
                <NFTCard key={item.tokenID} item={item} action={props.queryType == QueryType.owned ? ActionType.none : ActionType.unsubscribe} />
            ))}
        </Fragment>
    );
};

interface VehicleProps { queryType: QueryType }
