import { createClient } from 'urql';

export const APIURL = process.env.NEXT_PUBLIC_GRAPH_URL!;

export const queryAllNFTs = `
  query {
    tokens(
      orderBy: tokenID
      orderDirection: desc
    ) {
      tokenID
      ipfsCID
      metadataURI
      createdBy
    }
  }
`;

export const queryNFTsRented = `
  query UserToken ($address: String!) {
    tokens(
      orderBy: tokenID
      orderDirection: desc
      where: {
        owner: $address
      }
    ) {
      tokenID
      ipfsCID
      metadataURI
      owner {
        id
      }
    }
  }
`;

export const queryNFTsOwned = `
  query UserToken ($address: String!) {
    tokens(
      orderBy: tokenID
      orderDirection: desc
      where: {
        createdBy: $address
      }
    ) {
      tokenID
      ipfsCID
      metadataURI
      createdBy
    }
  }
`;

export const queryClient = createClient({
  url: APIURL
});
