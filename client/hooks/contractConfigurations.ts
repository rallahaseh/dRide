import { abi as marketplaceABI, address as marketplaceAddress } from '../contracts/marketplace';
import { abi as rentableVehiclesABI, address as rentableVehiclesAddress } from '../contracts/rentable-vehicles';

export const contractConfigurations = {
    marketplace: {
        address: marketplaceAddress,
        abi: marketplaceABI,
    },
    rentableVehicles: {
        address: rentableVehiclesAddress,
        abi: rentableVehiclesABI,
    },
    tokens: {
        usdc: {
            address: `0xaF7f7d3bC41dc0ab220De52B91ebeB5D48E9f4c7`
        }
    }
};
