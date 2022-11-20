import { createClient } from 'urql';

export const APIURL = process.env.NEXT_PUBLIC_GRAPH_URL!;

export const queryAvailableNFTs = `
query User($address: String!) {
  nftrenteds(orderBy: id, orderDirection: asc, where: { renter: $address }) {
    tokenId
    tokenURI
  }
  nftlisteds(
    orderBy: id
    orderDirection: asc
    where: { tokenURI_not: "", owner_not: $address }
  ) {
    tokenId
    tokenURI
  }
}
`;

export const queryNFTsRented = `
query User($address: String!) {
  nftrenteds(
    orderBy: tokenId
    orderDirection: desc
    where: { tokenURI_not: "", renter: $address }
  ) {
    tokenId
    tokenURI
  }
}
`;

export const queryNFTsOwned = `
query User($address: String!) {
  nftlisteds(
    orderBy: tokenId
    orderDirection: desc
    where: { tokenURI_not: "", owner: $address }
  ) {
    tokenId
    tokenURI
  }
  nftunlisteds(orderBy: id, orderDirection: asc) {
    tokenId
  }
}
`;

export const queryClient = createClient({
  url: APIURL
});
