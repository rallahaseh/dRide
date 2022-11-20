import { queryClient, queryAvailableNFTs, queryNFTsRented, queryNFTsOwned } from './query';

export enum QueryType {
  owned,
  rented
}

export const fetchAvailableNFTs = async (address?: string): Promise<NFTItem[]> => {
  const data = await queryClient.query(queryAvailableNFTs, { address: address?.toLowerCase() }).toPromise();
  let listedNFTs = data.data.nftlisteds;
  let rentedNFTs = data.data.nftrenteds;
  const difference = listedNFTs.filter((obj1: any) => {
    return rentedNFTs.some((obj2: any) => {
      return obj1.tokenId != obj2.tokenId
    })
  });
  return await Promise.all(
    difference.map(async (item: NFTData) => {
      let url = `https://nftstorage.link/ipfs/${item.tokenURI}/metadata.json`;
      const res = await fetch(url);
      const json = await res.json();
      return { ...json, ...item };
    })
  );
};

export const fetchListedNFTsBy = async (address?: string): Promise<NFTItem[]> => {
  const data = await queryClient.query(queryNFTsOwned, { address: address?.toLowerCase() }).toPromise();
  let tokens = data.data.nftlisteds;
  return await Promise.all(
    tokens.map(async (item: NFTData) => {
      let url = `https://nftstorage.link/ipfs/${item.tokenURI}/metadata.json`;
      const res = await fetch(url);
      const json = await res.json();
      return { ...json, ...item };
    })
  );
};

export const fetchRentedNFTsBy = async (address?: string): Promise<NFTItem[]> => {
  const data = await queryClient.query(queryNFTsRented, { address: address?.toLowerCase() }).toPromise();
  let tokens = data.data.nftrenteds;
  return await Promise.all(
    tokens.map(async (item: NFTData) => {
      let url = `https://nftstorage.link/ipfs/${item.tokenURI}/metadata.json`;
      const res = await fetch(url);
      const json = await res.json();
      return { ...json, ...item };
    })
  );
};

export type NFTData = {
  tokenId: number;
  tokenURI: string;
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
