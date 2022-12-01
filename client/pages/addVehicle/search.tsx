import { FC, useState } from 'react';
// MUI Components
import {
    Box,
    Grid
} from '@mui/material';
// Mbox
import Geocoder from '../../components/geocoder';
import { Feature } from '../../components/geocoder/result'

interface SearchLocationProps {
    onSelectLocationHandler: (location: Feature) => void
}

const SearchLocation: FC<SearchLocationProps> = (props: SearchLocationProps) => {
    const mboxAccessToken = process.env.NEXT_PUBLIC_MBOX_ACCESS_TOKEN!
    const [userLocation, setAddress] = useState<Feature | null>(null);

    const onSelectLocationHandler = (result: Feature) => {
        console.log('Selected location: ', result)
        setAddress(result)
        props.onSelectLocationHandler(result)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Grid container spacing={5}>
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={12}>
                    <Geocoder
                        inputPlaceholder="Your address"
                        accessToken={mboxAccessToken}
                        onSelect={onSelectLocationHandler}
                        onClear={() => { setAddress(null) }}
                        showLoader={true}
                    />
                </Grid>
            </Grid>
        </Box>

    );
}

export default SearchLocation;