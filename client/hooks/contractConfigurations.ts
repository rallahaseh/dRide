import { abi as marketplaceABI, address as marketplaceAddress } from '../contracts/marketplace';
import { abi as rentableVehiclesABI, address as rentableVehiclesAddress } from '../contracts/rentable-vehicles';
import { abi as nftABI, address as nftAddress } from '../contracts/nft';

export const contractConfigurations = {
    marketplace: {
        address: marketplaceAddress,
        abi: marketplaceABI,
    },
    rentableVehicles: {
        address: rentableVehiclesAddress,
        abi: rentableVehiclesABI,
    },
    nft: {
        address: nftAddress,
        abi: nftABI,
    }
};
