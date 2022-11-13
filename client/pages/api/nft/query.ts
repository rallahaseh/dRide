import { createClient } from 'urql';

export const APIURL = process.env.NEXT_PUBLIC_GRAPH_URL!;

export const queryAllNFTs = `
  query {
    mintedTokens(
      orderBy: tokenID
      orderDirection: desc
    ) {
      tokenID
      ipfsCID
      metadataURI
    }
  }
`;

export const queryNFTsRented = `
  query UserToken ($address: String!) {
    rentedTokens(
      orderBy: tokenID
      orderDirection: desc
      where: {
        renter: $address
      }
    ) {
      tokenID
      ipfsCID
      metadataURI
    }
  }
`;

export const queryNFTsOwned = `
  query UserToken ($address: String!) {
    mintedTokens(
      orderBy: tokenID
      orderDirection: desc
      where: {
        owner: $address
      }
    ) {
      tokenID
      ipfsCID
      metadataURI
    }
  }
`;

export const queryClient = createClient({
  url: APIURL
});
