import { queryClient, queryUserData, queryTokensList } from './query';

export enum QueryType {
  listed,
  rented
}

export const fetchUserNFTs = async (userAddress?: string): Promise<UserData> => {
  const data = await queryClient.query(queryUserData, { userAddress: userAddress?.toLowerCase() }).toPromise();
  const mintedTokens = data.data.user.mintedTokens;
  const promise1: NFTItem[] = await Promise.all(
    mintedTokens.map(async (item: NFTData) => {
      const res = await fetch(item.metadataURI);
      const json = await res.json();
      return { ...json, ...item };
    })
  );
  const listedTokens = data.data.user.listedTokens;
  const promise2: NFTItem[] = await Promise.all(
    listedTokens.map(async (item: NFTData) => {
      const res = await fetch(item.metadataURI);
      const json = await res.json();
      return { ...json, ...item };
    })
  );
  const rentedTokens = data.data.user.rentedTokens;
  const promise3: NFTItem[] = await Promise.all(
    rentedTokens.map(async (item: NFTData) => {
      const res = await fetch(item.metadataURI);
      const json = await res.json();
      return { ...json, ...item };
    })
  );

  return await Promise.all([promise1, promise2, promise3]).then((values) => {
    let data: UserData = {
      mintedTokens: values[0],
      listedTokens: values[1],
      rentedTokens: values[2]
    }
    console.log('UserData')
    console.log(data)
    return data
  });
};

export const fetchAvailableNFTs = async (): Promise<NFTItem[]> => {
  const data = await queryClient.query(queryTokensList, {}).toPromise();
  let tokens = data.data.tokens;
  const list = await Promise.all(
    tokens.map(async (item: NFTData) => {
      const res = await fetch(item.metadataURI);
      const json = await res.json();
      return { ...json, ...item };
    })
  );
  console.log('NFTs')
  console.log(list)
  return list
};

export type NFTData = {
  tokenID: number;
  tokenURI: string;
  contentURI: string;
  metadataURI: string;
  creationDate: number;
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

export type UserData = {
  mintedTokens: NFTItem[],
  listedTokens: NFTItem[],
  rentedTokens: NFTItem[]
}