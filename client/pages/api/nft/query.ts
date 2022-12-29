import { createClient } from 'urql';

export const APIURL = process.env.NEXT_PUBLIC_GRAPH_URL!;

export const queryUserData = `
query getDataFor($userAddress: String!) {
  user(orderBy: id, orderDirection: desc, id: $userAddress) {
    mintedTokens(
      orderBy: id
      orderDirection: desc
      where: { creator: $userAddress }
    ) {
      id
      tokenID
      contentURI
      metadataURI
      creationDate
      creator {
        id
      }
    }
    listedTokens(
      orderBy: id
      orderDirection: desc
      where: { owner: $userAddress }
    ) {
      id
      tokenID
      contentURI
      metadataURI
      creationDate
      creator {
        id
      }
      owner {
        id
      }
    }
    rentedTokens(
      orderBy: id
      orderDirection: desc
      where: { renter: $userAddress }
    ) {
      id
      tokenID
      contentURI
      metadataURI
      creationDate
      creator {
        id
      }
      owner {
        id
      }
      renter {
        id
      }
    }
  }
}
`

export const queryTokensList = `
query {
  tokens(orderBy: id, orderDirection: desc, where: { renter: null }) {
    id
    tokenID
    contentURI
    metadataURI
    creationDate
  }
}
`

export const queryClient = createClient({
  url: APIURL
});
