import { queryClient, queryNFTsRented, queryNFTsOwned } from './query';

export enum QueryType {
  owned,
  rented
}

export const fetchAllNFTs = async (data: NFTData[]): Promise<NFTItem[]> => {
  return await Promise.all(
    data.map(async (item: NFTData) => {
      const res = await fetch(item.metadataURI);
      const json = await res.json();
      return { ...json, ...item };
    })
  );
};

export const fetchNFTsBy= async (type: QueryType, address?: string): Promise<NFTItem[]> => {
  const data = await queryClient.query(type == QueryType.owned ? queryNFTsOwned : queryNFTsRented, { address: address?.toLowerCase() }).toPromise();
  return await Promise.all(
    data.data.tokens.map(async (item: NFTData) => {
      const res = await fetch(item.metadataURI);
      const json = await res.json();
      return { ...json, ...item };
    })
  );
};

export type NFTData = {
  tokenID: number;
  ipfsCID: string;
  createdBy: string;
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
    latitude: number;
    longitude: number;
    name: string;
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
