import { queryClient, queryAvailableNFTs, queryNFTsRented, queryNFTsOwned } from './query';

export enum QueryType {
  owned,
  rented
}

export const fetchAvailableNFTs = async (address?: string): Promise<NFTItem[]> => {
  const data = await queryClient.query(queryAvailableNFTs, { address: address?.toLowerCase() }).toPromise();
  let tokens = data.data.mintedTokens;  
  return await Promise.all(
    tokens.map(async (item: NFTData) => {
      if (item.ipfsCID.length > 0) {
        const res = await fetch(item.metadataURI);
        const json = await res.json();
        return { ...json, ...item };
      }
    })
  );
};

export const fetchMintedNFTsBy = async (address?: string): Promise<NFTItem[]> => {
  const data = await queryClient.query(queryNFTsOwned, { address: address?.toLowerCase() }).toPromise();
  let tokens = data.data.mintedTokens;
  return await Promise.all(
    tokens.map(async (item: NFTData) => {
      if (item.ipfsCID.length > 0) {
        const res = await fetch(item.metadataURI);
        const json = await res.json();
        return { ...json, ...item };
      }
    })
  );
};

export const fetchRentedNFTsBy = async (address?: string): Promise<NFTItem[]> => {
  const data = await queryClient.query(queryNFTsRented, { address: address?.toLowerCase() }).toPromise();
  let tokens = data.data.rentedTokens;
  console.log(tokens);
  return await Promise.all(
    tokens.map(async (item: NFTData) => {
      if (item.ipfsCID.length > 0) {
        const res = await fetch(item.metadataURI);
        const json = await res.json();
        return { ...json, ...item };
      }
    })
  );
};

export type NFTData = {
  tokenID: number;
  ipfsCID: string;
  metadataURI: string;
};

export type NFTItem = NFTData & {
  vehicle: {
    brand: string;
    model: string;
    type: string;
    year: string;
  }
  userLocation: {
    latitude?: number;
    longitude?: number;
    name?: string;
  },
  thumbnail: {
    name: string;
    originalName: string;
    type: string;
    size: number;
    datetime: number;
  },
  date: {
    from: number,
    to: number
  },
  price: string;
};
