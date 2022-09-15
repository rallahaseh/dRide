import { TextInput, Text, Button, Group, Box, Avatar, Select, useMantineTheme, Image, SimpleGrid, Divider, Space, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { forwardRef, useEffect, useState } from 'react';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { Map } from '../../main/Map/Map'
import { stringToBytes32 } from '../../../utils/StringUtils';
import useContractFunction, { Contracts } from '../../../hooks/UseContract';

const getVehicleTypeList = [
    {
        image: 'https://img.icons8.com/external-soft-fill-juicy-fish/344/external-hatchback-vehicles-soft-fill-soft-fill-juicy-fish.png',
        label: 'Hatchback',
        value: '1',
        description: 'The most noticeable part of a hatchback is its hatch or a rear door that swings upward.',
    },

    {
        image: 'https://img.icons8.com/external-flaticons-flat-flat-icons/344/external-sedan-automotive-ecommerce-flaticons-flat-flat-icons.png',
        label: 'Sedan',
        value: '2',
        description: 'A sedan is a conventional example of a four-door passenger vehicle.',
    },
    {
        image: 'https://img.icons8.com/color/344/suv.png',
        label: 'SUV',
        value: '3',
        description: 'A Sport Utility Vehicle(SUV) is defined by its off-road capabilities and roominess. It boasts a comfortable ride in rough, rugged cross-country terrain.',
    },
    {
        image: 'https://img.icons8.com/office/344/suv.png',
        label: 'MUV',
        value: '4',
        description: 'A Multi Utility Vehicle(MUV), which can be used for both passengers and luggage.',
    },
    {
        image: 'https://img.icons8.com/external-microdots-premium-microdot-graphic/344/external-jeep-transportation-vol1-microdots-premium-microdot-graphic-2.png',
        label: 'Crossover',
        value: '5',
        description: 'A combination of an SUV and a hatchback',
    },
    {
        image: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/344/external-coupe-automotive-ecommerce-flaticons-lineal-color-flat-icons.png',
        label: 'Coupe',
        value: '6',
        description: 'A two-door vehicle with a trunk and a fixed roof',
    },
    {
        image: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/344/external-convertible-vacation-planning-girls-trip-flaticons-lineal-color-flat-icons.png',
        label: 'Convertible',
        value: '7',
        description: 'A convertible or a cabriolet is a vehicle that has a roof that can be removed or folded down. ',
    }
];

interface VehicleTypeItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string;
    label: string;
    description: string;
}

const SelectItem = forwardRef<HTMLDivElement, VehicleTypeItemProps>(
    ({ image, label, description, ...others }: VehicleTypeItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <Avatar src={image} />
                <div>
                    <Text size="sm">{label}</Text>
                    <Text size="xs" color="dimmed">
                        {description}
                    </Text>
                </div>
            </Group>
        </div>
    )
);

export function AddVehicle(props: Partial<DropzoneProps>) {
    const theme = useMantineTheme();
    // Hooks
    const { loading, success, error, send } = useContractFunction(Contracts.Vehicle.addVehicle);

    useEffect(() => {
        if (success) {
            console.log("Success added car");
        }
    }, [success]);

    // Form
    const form = useForm({
        initialValues: {
            name: '',
            vehicleType: '',
            brand: '',
            model: 0,
            cost: 0,
        },

        // Functions will be used to validate values at corresponding key
        validate: {
            name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            vehicleType: (value) => (value.length == 0 ? 'You should select the vehicle type' : null),
            brand: (value) => (value.length < 2 ? 'Brand must have at least 2 letters' : null),
            model: (value) => (value < 2000 ? 'Model should be greater than 2000' : null),
            cost: (value) => (value < 1 ? 'Cost should be greater than 0' : null),
        },
    });
    const handleSubmit = async (values: typeof form.values) => {
        console.log(values);
        await send(
            stringToBytes32(values.name),
            stringToBytes32(values.brand),
            values.vehicleType,
            stringToBytes32(""), // Latitude
            stringToBytes32(""), // Longitude
            values.model,
            stringToBytes32(""), // Image
            values.cost
        );
    }

    // Upload Files
    const [files, setFiles] = useState<FileWithPath[]>([]);
    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <Image
                key={index}
                src={imageUrl}
                imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
            />
        );
    });


    return (
        <Box sx={{ maxWidth: 300 }} mx="auto">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    withAsterisk
                    label="vehicle name"
                    placeholder="Model X"
                    {...form.getInputProps('name')}
                />
                <TextInput
                    withAsterisk
                    label="Brand"
                    placeholder="Tesla"
                    {...form.getInputProps('brand')}
                />
                <Select
                    withAsterisk
                    label="Choose the vehicle type"
                    placeholder="Crossover"
                    itemComponent={SelectItem}
                    data={getVehicleTypeList}
                    searchable
                    maxDropdownHeight={400}
                    nothingFound="Notfound"
                    filter={(value, item) =>
                        item.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
                        item.description.toLowerCase().includes(value.toLowerCase().trim())
                    }
                    {...form.getInputProps('vehicleType')}
                />
                <NumberInput
                    withAsterisk
                    label="Model"
                    description="Enter the vehicle model which should be greater than 2000"
                    {...form.getInputProps('model')}
                />
                <NumberInput
                    withAsterisk
                    label="Cost"
                    description="Place your cost per day, it will be in USD"
                    {...form.getInputProps('cost')}
                />
                <Group position="center" mt="md">
                    <Text>Image</Text>
                    <Dropzone
                        onDrop={setFiles}
                        onReject={(files) => console.log('rejected files', files)}
                        maxSize={3 * 1024 ** 2}
                        maxFiles={1}
                        accept={IMAGE_MIME_TYPE}
                        {...props}
                    >
                        <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
                            <Dropzone.Accept>
                                <IconUpload
                                    size={50}
                                    stroke={1.5}
                                    color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                                />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX
                                    size={50}
                                    stroke={1.5}
                                    color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                                />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <IconPhoto size={50} stroke={1.5} />
                            </Dropzone.Idle>

                            <div>
                                <Text size="xl" inline>
                                    Drag the image here or click to select files
                                </Text>
                                <Text size="sm" color="dimmed" inline mt={7}>
                                    Attach the image file, which should not exceed 5MB
                                </Text>
                            </div>
                        </Group>
                    </Dropzone>
                    <SimpleGrid
                        cols={4}
                        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                        mt={previews.length > 0 ? 'xl' : 0}
                    >
                        {previews}
                    </SimpleGrid>
                </Group>
                <Group position="center" mt="md">
                    <Map />
                </Group>
                {!!error && (
                    <>
                        <Space h="md" />
                        <Text color="red">
                            An error occurred: {error}
                        </Text>
                    </>
                )}
                <Group position="center" mt="md">
                    <Button type="submit" loading={loading}>Add Vehicle</Button>
                </Group>
            </form>
        </Box>
    );
}