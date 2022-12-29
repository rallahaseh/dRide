import { FC, useState, useMemo, useEffect } from 'react';
// Form
import { useForm } from 'react-hook-form'
// MUI Components
import {
    Box,
    Grid,
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
import DateRangeIcon from '@mui/icons-material/DateRange';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ImageIcon from '@mui/icons-material/Image';
// Date picker
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
    LocalizationProvider,
    DatePicker
} from '@mui/x-date-pickers';
// Mapbox
import { Feature } from '../../components/geocoder/result'
// NFT Storage
import { useNFTStorage } from '../../hooks/useNFTStorage';
// Contracts
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useContractEvent } from 'wagmi';
import { contractConfigurations } from '../../hooks/contractConfigurations';
import { BigNumber } from 'ethers';

interface CreateData {
    vehicleBrand: string;
    vehicleModel: string;
    vehicleYear: string;
    pricePerDay: number;
    thumbnail: File;
}

export interface VehicleData {
    tokenID: BigNumber
    pricePerDay: BigNumber
    startDate: BigNumber
    endDate: BigNumber
}

interface MintVehicleProps {
    userLocation: Feature
    onCompletion: (metadata: VehicleData) => void
}

const MintVehicle: FC<MintVehicleProps> = (props: MintVehicleProps) => {
    // Constants
    const dateObject = new Date();
    const today = `${dateObject.getFullYear()}-${dateObject.getMonth() + 1}-${dateObject.getDate()}`;
    // Registered
    const [vehicleType, setVehicleType] = useState("Petrol");
    const [fromDate, setFromDate] = useState<Dayjs | null>(null);
    const [toDate, setToDate] = useState<Dayjs | null>(null);
    const [tokenURI, setTokenURI] = useState('');
    const [mockdata, setMockdata] = useState<VehicleData>();
    const [metadata, setMetadata] = useState<VehicleData>();

    // Image
    const [thumbnail, setThumbnail] = useState<File>();
    const previewImageURL = useMemo(() => {
        return thumbnail && URL.createObjectURL(thumbnail);
    }, [thumbnail]);

    // Component handlers
    const handleTypeChange = (event: SelectChangeEvent) => {
        setVehicleType(event.target.value);
    }

    // Web3
    // NFT.Storage
    const { store, isStoreLoading } = useNFTStorage();
    // Mint NFT
    const { config: mintNFTConfig } = usePrepareContractWrite({
        ...contractConfigurations.rentableVehicles,
        functionName: 'mint',
        args: [
            tokenURI
        ]
    });
    const {
        data: mintNFTRequestData,
        writeAsync: mintNFT,
        isLoading: isMintNFTRequestLoading,
        isSuccess: isMintNFTRequestStarted,
        error: mintNFTRequestError,
    } = useContractWrite(mintNFTConfig);
    const {
        data: mintNFTTransactionData,
        error: mintNFTTransactionError,
        isLoading: isMintNFTTransactionLoading
    } = useWaitForTransaction({
        hash: mintNFTRequestData?.hash,
        onError: () => {
            console.log("mintNFT - Error: ", mintNFTTransactionData);
        },
        onSuccess: () => {
            console.log("mintNFT - Success: ", mintNFTTransactionError);
        }
    });
    // Events
    useContractEvent({
        ...contractConfigurations.rentableVehicles,
        eventName: 'mintedNFT',
        listener(node, label, owner, event) {
            const _tokenID = event.args[0];
            setMetadata({
                tokenID: _tokenID,
                pricePerDay: mockdata?.pricePerDay!,
                startDate: mockdata?.startDate!,
                endDate: mockdata?.endDate!
            });
            console.log('mintedNFT event: ', event.args);
        }
    });

    const isLoading = useMemo<boolean>(() => {
        return Boolean(isMintNFTRequestLoading || isMintNFTTransactionLoading || isStoreLoading);
    }, [
        isMintNFTRequestLoading,
        isMintNFTTransactionLoading,
        isStoreLoading
    ]);

    const uploadToIPFS = (async (data: CreateData) => {
        const _metadata = {
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
                latitude: props.userLocation?.geometry.coordinates[0],
                longitude: props.userLocation?.geometry.coordinates[1],
                name: props.userLocation?.place_name
            },
            price: data.pricePerDay,
            thumbnail: thumbnail!
        }
        setMockdata({
            tokenID: BigNumber.from(0),
            pricePerDay: BigNumber.from(_metadata.price!),
            startDate: BigNumber.from(_metadata.date.from! + 1800),
            endDate: BigNumber.from(_metadata.date.to!)
        });
        if (isStoreLoading) return;
        const CID = await store(_metadata);
        console.log("CID", CID)
        setTokenURI(CID!);
        let url = `https://nftstorage.link/ipfs/${CID}`;
        CID && console.log(`IPFS address: ${url}`);
        return CID
    });

    useEffect(() => {
        if (!metadata) return;
        props.onCompletion(metadata!);
    }, [metadata])

    // Form submition
    const { register, handleSubmit } = useForm<CreateData>();

    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submitData(event);
    };

    const submitData = handleSubmit(async (data: CreateData) => {
        const CID = await uploadToIPFS(data);
        if (!CID) return;
        await mintNFT?.({ recklesslySetUnpreparedArgs: [CID] })
    });

    return (
        <Box
            component='form'
            autoComplete='off'
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            onSubmit={onSubmitHandler}
        >
            <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    {/* User Location */}
                    <Grid item xs={12}>
                        <TextField
                            disabled
                            id="user-location"
                            label="Location"
                            fullWidth
                            defaultValue={props.userLocation?.place_name}
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
                                        const date = new Date();
                                        const hour = date.getHours();
                                        const minutes = date.getMinutes();
                                        const selectedDate = dayjs(newValue)
                                            .set('hour', hour)
                                            .set('minute', minutes)
                                        setFromDate(selectedDate);
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
                                    minDate={dayjs(fromDate).add(1, 'day')}
                                    onChange={(newValue) => {
                                        const date = new Date();
                                        const hour = date.getHours();
                                        const minutes = date.getMinutes();
                                        const selectedDate = dayjs(newValue)
                                            .set('hour', hour)
                                            .set('minute', minutes)
                                        setToDate(selectedDate);
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
                                        <AttachMoneyIcon />
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
                    {isLoading && <CircularProgress />}
                    {!isLoading && 'Add Vehicle'}
                </Button>
            </Box>
        </Box>
    );
}

export default MintVehicle;