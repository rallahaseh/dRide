import { FC, useState } from 'react';
// MUI Components
import {
    Container,
    Box,
    Grid,
    Avatar,
    Typography,
    Stack,
    TextField,
    Button
} from '@mui/material';
import DirectionsCarFilledTwoToneIcon from '@mui/icons-material/DirectionsCarFilledTwoTone';
// Date picker
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// Mbox
import Geocoder from '../../components/geocoder';
import { Feature } from '../../components/geocoder/result'

export const SearchVehicle: FC<SearchVehicleProps> = (props: SearchVehicleProps) => {
    const [fromDate, setFromDate] = useState<Dayjs | null>(null);
    const [toDate, setToDate] = useState<Dayjs | null>(null);
    const [address, setAddress] = useState<Feature | null>(null);

    const mboxAccessToken = process.env.NEXT_PUBLIC_MBOX_ACCESS_TOKEN!
    const dateObject = new Date();
    const today = `${dateObject.getFullYear()}-${dateObject.getMonth() + 1}-${dateObject.getDate()}`;

    const onSelectLocationHandler = (result: Feature) => {
        console.log(result)
        setAddress(result)
    }

    return (
        <Container sx={{ p: 4 }} maxWidth="md">
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <Grid
                            container
                            spacing={1}
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                                <DirectionsCarFilledTwoToneIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Search for a Vehicle
                            </Typography>
                        </Grid>
                        <Box
                            justifyContent="center"
                            alignItems="center"
                            sx={{ p: 2, border: '2px dashed grey', borderRadius: '16px' }}
                        >
                            <Stack spacing={2}>
                                <Stack direction="row" spacing={2} justifyContent="center">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="From"
                                            value={fromDate}
                                            minDate={dayjs(today)}
                                            onChange={(newValue) => {
                                                setFromDate(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                        <DatePicker
                                            label="To"
                                            value={toDate}
                                            disabled={!fromDate}
                                            minDate={fromDate}
                                            onChange={(newValue) => {
                                                setToDate(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                                <Geocoder
                                    inputPlaceholder="Search Address"
                                    accessToken={mboxAccessToken}
                                    onSelect={onSelectLocationHandler}
                                    onClear={() => { setAddress(null) }}
                                    showLoader={true}
                                />
                                <Button
                                    variant="contained"
                                    disabled={!toDate}
                                    onClick={() => {
                                        props.onSearchClickedHandler({
                                            date: {
                                                from: fromDate?.unix()!,
                                                to: toDate?.unix()!
                                            },
                                            location: address
                                        })
                                    }}
                                >
                                    Search
                                </Button>
                            </Stack>
                        </Box>

                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export interface SearchResult {
    date: {
        from: number | null,
        to: number | null
    },
    location?: Feature | null
}

interface SearchVehicleProps {
    onSearchClickedHandler: (result: SearchResult) => void;
}
