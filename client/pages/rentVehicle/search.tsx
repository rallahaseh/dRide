import { FC, useState } from 'react';
// MUI Components
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
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
            <Typography variant="h3" component="h2">
                Search for a vehicle
            </Typography>
            <Box
                justifyContent="center"
                alignItems="center"
                sx={{ p: 2, border: '1px dashed grey' }}
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
