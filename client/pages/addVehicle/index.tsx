import { useState, useMemo } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router'
// Form
import { useForm } from 'react-hook-form'
// MUI Components
import {
    Container,
    Box,
    Grid,
    Avatar,
    Typography,
    TextField,
    InputLabel,
    Select,
    SelectChangeEvent,
    MenuItem,
    InputAdornment,
    Card,
    CardActionArea,
    CardActions,
    CardMedia,
    Button,
    CircularProgress
} from '@mui/material';
// MUI Icons
import DirectionsCarFilledTwoToneIcon from '@mui/icons-material/DirectionsCarFilledTwoTone';
import DateRangeIcon from '@mui/icons-material/DateRange';
import EuroIcon from '@mui/icons-material/Euro';
import ImageIcon from '@mui/icons-material/Image';
// Date picker
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
    LocalizationProvider,
    DatePicker
} from '@mui/x-date-pickers';
// Mbox
import Geocoder from '../../components/geocoder';
import { Feature } from '../../components/geocoder/result'
// NFT Storage
import { useNFTStorage } from '../../hooks/useNFTStorage';
// Contracts
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { contractConfigurations } from '../../hooks/contractConfigurations';
import { BigNumber } from 'ethers';
import { AlertDialog } from '../../components';

enum State {
    getUserLocation,
    getVehicleInformation
}

interface CreateData {
    vehicleBrand: string;
    vehicleModel: string;
    vehicleYear: string;
    pricePerDay: number;
    thumbnail: File;
}

interface MintParams {
    tokenURI: string;
    pricePerDay: BigNumber;
    startDateUnix: BigNumber;
    endDateUnix: BigNumber;
}

const IndexPage: NextPage = () => {
    // Constants
    const router = useRouter()
    const mboxAccessToken = process.env.NEXT_PUBLIC_MBOX_ACCESS_TOKEN!
    const dateObject = new Date();
    const today = `${dateObject.getFullYear()}-${dateObject.getMonth() + 1}-${dateObject.getDate()}`;
    // Registered
    const [state, setState] = useState<State>(State.getUserLocation);
    const [userLocation, setAddress] = useState<Feature | null>(null);
    const [vehicleType, setVehicleType] = useState("Petrol");
    const [fromDate, setFromDate] = useState<Dayjs | null>(null);
    const [toDate, setToDate] = useState<Dayjs | null>(null);
    const [mintParams, setMintParams] = useState<MintParams>();
    const [showAlert, setShowAlert] = useState<Boolean>(false);

    // Image
    const [thumbnail, setThumbnail] = useState<File>();
    const previewImageURL = useMemo(() => {
        return thumbnail && URL.createObjectURL(thumbnail);
    }, [thumbnail]);

    // Component handlers
    const onSelectLocationHandler = (result: Feature) => {
        console.log(result)
        setAddress(result)
        setState(State.getVehicleInformation)
    }
    const handleTypeChange = (event: SelectChangeEvent) => {
        setVehicleType(event.target.value);
    }
    const handleClosePage = () => {
        setShowAlert(false);
        router.push('/')
    };

    // Web3
    const { store, isStoreLoading } = useNFTStorage();
    const { config: contractWriteConfig } = usePrepareContractWrite({
        ...contractConfigurations.nft,
        functionName: 'mint',
        args: [
            mintParams?.tokenURI!,
            mintParams?.pricePerDay!,
            mintParams?.startDateUnix!,
            mintParams?.endDateUnix!
        ]
    });
    const {
        data: requestData,
        writeAsync: mint,
        isLoading: isRequestLoading,
        isSuccess: isRequestStarted,
        error: requestError,
    } = useContractWrite(contractWriteConfig);
    const {
        data: txData,
        error: txError,
        isLoading: isTransactionLoading
    } = useWaitForTransaction({
        hash: requestData?.hash,
        onError: () => { setShowAlert(true); },
        onSuccess: () => { setShowAlert(true); }
    });
    const isLoading = useMemo<boolean>(() => {
        return Boolean(isRequestLoading || isTransactionLoading || isStoreLoading);
    }, [isRequestLoading, isTransactionLoading, isStoreLoading]);

    const uploadToIPFS = (async (data: CreateData) => {
        const metadata = {
            vehicle: {
                brand: data.vehicleBrand,
                model: data.vehicleModel,
                type: vehicleType,
                year: data.vehicleYear
            },
            date: {
                from: fromDate?.unix(),
                to: toDate?.unix()
            },
            location: {
                latitude: userLocation?.geometry.coordinates[0],
                longitude: userLocation?.geometry.coordinates[1],
                name: userLocation?.place_name
            },
            price: data.pricePerDay,
            thumbnail: thumbnail!
        }
        if (isStoreLoading) return;
        const CID = await store(metadata);
        let url = `https://nftstorage.link/ipfs/${CID}`;
        CID && console.log(`IPFS address: ${url}`);
        setMintParams({
            tokenURI: CID!,
            pricePerDay: BigNumber.from(data.pricePerDay),
            startDateUnix: BigNumber.from(fromDate?.unix()),
            endDateUnix: BigNumber.from(toDate?.unix())
        })
        return CID
    });

    // Form submition
    const { register, handleSubmit } = useForm<CreateData>();

    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submitData(event);
    };
    const submitData = handleSubmit(async (data: CreateData) => {
        await uploadToIPFS(data)
        if (isLoading) return;
        try {
            await mint?.();
        }
        catch (error) {
            console.log(error)
        }
        finally {
            // reset();
            // clearErrors();
        }
    });

    const SearchLocationComponent = () => {
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
                        <Typography component="h1" variant="h5">
                            Add Vehicle
                        </Typography>
                        <Typography component="h1" variant="h5" padding={3}>
                            Start by giving your address
                        </Typography>
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

    const AddVehicleComponent = () => {
        return (
            <Box
                display='flex'
                flexDirection='column'
                component='form'
                autoComplete='off'
                sx={{ paddingRight: { sm: '3rem' } }}
                onSubmit={onSubmitHandler}
            >
                <Grid
                    container
                    spacing={1}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >

                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <DirectionsCarFilledTwoToneIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Add Vehicle
                    </Typography>
                </Grid>
                <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        {/* User Location */}
                        <Grid item xs={12}>
                            <TextField
                                disabled
                                id="user-location"
                                label="Location"
                                fullWidth
                                defaultValue={userLocation?.place_name}
                            />
                        </Grid>
                        {/* Vehicle Brand */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="brand"
                                label="Vehicle Brand"
                                {...register('vehicleBrand', { required: 'Vehicle brand is required' })}
                            />
                        </Grid>
                        {/* Vehicle Model */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="model"
                                label="Vehicle Model"
                                {...register('vehicleModel', { required: 'Vehicle model is required' })}
                            />
                        </Grid>
                        {/* Vehicle Type */}
                        <Grid item xs={12} sm={6}>
                            <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>
                            <Select
                                id="type"
                                fullWidth
                                value={vehicleType}
                                onChange={handleTypeChange}
                            >
                                <MenuItem value={"Petrol"}>Petrol</MenuItem>
                                <MenuItem value={"Electric"}>Electric</MenuItem>
                                <MenuItem value={"Diesel"}>Diesel</MenuItem>
                            </Select>
                        </Grid>
                        {/* Vehicle Year */}
                        <Grid item xs={12} sm={6}>
                            <InputLabel id="vehicle-type-label">Vehicle Year</InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="year"
                                type="number"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DateRangeIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                {...register('vehicleYear', { required: 'Vehicle model is required' })}
                            />
                        </Grid>
                        {/* Date */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid item xs={12} sm={6}>
                                <Grid container justifyContent="center" spacing={0}>
                                    <DatePicker
                                        label="From"
                                        value={fromDate}
                                        minDate={dayjs(today)}
                                        onChange={(newValue) => {
                                            setFromDate(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Grid container justifyContent="center" spacing={0}>
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
                                </Grid>
                            </Grid>
                        </LocalizationProvider>
                        {/* Price */}
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="price"
                                label="Price per day"
                                type="number"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EuroIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                {...register('pricePerDay', { required: 'Vehicle price is required' })}
                            />
                        </Grid>
                        {/* Dropzone */}
                        <Grid item xs={12}>
                            <Card sx={{ maxHeight: 345 }}>
                                <CardActions style={{ justifyContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                    >
                                        <ImageIcon /> Upload Image
                                        <input
                                            id="thumbnail"
                                            name="thumbnail"
                                            hidden
                                            accept="image/*"
                                            type="file"
                                            onChange={(event) => {
                                                if (event.target.files && event.target.files[0]) {
                                                    const img = event.target.files[0];
                                                    img && setThumbnail(img);
                                                }
                                            }}
                                        />
                                    </Button>
                                </CardActions>
                                {thumbnail && <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        alt="upload-image"
                                        image={previewImageURL && previewImageURL}
                                        sx={{ width: "100%", height: "345px", layout: "responsive", objectFit: "contain" }}
                                    />
                                </CardActionArea>}
                            </Card>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading && 'Loading...' && <CircularProgress />}
                        {!isLoading && 'Add Vehicle'}
                    </Button>
                </Box>
            </Box>
        );
    }

    if (showAlert) {
        var title, description, primaryActionTitle = ''
        if (txError) {
            title = 'Error'
            description = 'An error has been occured while doing the transaction, please try again later.'
            primaryActionTitle = 'Okay'
        } else {
            title = 'Completed'
            description = 'The vehicle has been added to the list successfully!'
            primaryActionTitle = 'Done'
        }
        return (
            <AlertDialog
                title={title}
                description={description}
                primaryActionTitle={primaryActionTitle}
                primaryAction={handleClosePage}
            />
        );
    }

    return (
        <Container component="main" maxWidth="md">
            {state === State.getUserLocation && <SearchLocationComponent />}
            {state === State.getVehicleInformation && <AddVehicleComponent />}
        </Container>
    );
}

export default IndexPage;