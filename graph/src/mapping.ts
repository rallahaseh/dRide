import {
    NFTListed as NFTListedEvent,
    NFTRented as NFTRentedEvent,
    NFTUnlisted as NFTUnlistedEvent,
} from "../generated/Marketplace/Marketplace"

import {
    burntNFT as NFTBurntEvent,
    mintedNFT as NFTMintedEvent,
    RentableVehicles as RentableVehiclesContract
} from "../generated/RentableVehicles/RentableVehicles"

import { Token, User } from "../generated/schema"

// RentableVehiclesContract

export function handleMintedNFT(event: NFTMintedEvent): void {
    const nftContract = RentableVehiclesContract.bind(event.address);
    let token = Token.load(event.params.tokenId.toString());
    if (!token) {
        token = new Token(event.params.tokenId.toString());
        token.tokenID = event.params.tokenId;
        token.creationDate = event.block.timestamp;
        token.contentURI = nftContract.tokenURI(event.params.tokenId);
        const metadataURI = `https://nftstorage.link/ipfs/${nftContract.tokenURI(event.params.tokenId)}/metadata.json`;
        token.metadataURI = metadataURI
    }
    token.creator = nftContract.ownerOf(event.params.tokenId).toHexString();
    token.save();

    let user = User.load(nftContract.ownerOf(event.params.tokenId).toHexString());
    if (!user) {
        user = new User(event.transaction.from.toHexString());
        user.save();
    }
}

export function handleBurntNFT(event: NFTBurntEvent): void { }

// MarketplaceContract

export function handleListedNFT(event: NFTListedEvent): void {
    let token = Token.load(event.params.tokenId.toString());
    if (!token) {
        token = new Token(event.params.tokenId.toString());
        token.tokenID = event.params.tokenId;
        token.contentURI = event.params.tokenURI;
        const metadataURI = `https://nftstorage.link/ipfs/${event.params.tokenURI}/metadata.json`;
        token.metadataURI = metadataURI
        token.rentalStartDate = event.params.startDateUNIX;
        token.rentalFinishDate = event.params.endDateUNIX;
    }
    token.owner = event.params.owner.toHexString();
    token.save();

    let user = User.load(event.params.owner.toHexString());
    if (!user) {
        user = new User(event.transaction.from.toHexString());
        user.save();
    }
}

export function handleRentedNFT(event: NFTRentedEvent): void {
    let token = Token.load(event.params.tokenId.toString());
    if (!token) {
        token = new Token(event.params.tokenId.toString());
        token.tokenID = event.params.tokenId;
        token.contentURI = event.params.tokenURI;
        const metadataURI = `https://nftstorage.link/ipfs/${event.params.tokenURI}/metadata.json`;
        token.metadataURI = metadataURI
        token.rentalStartDate = event.params.startDateUNIX;
        token.rentalFinishDate = event.params.endDateUNIX;
    }
    token.renter = event.params.renter.toHexString();
    token.save();

    let user = User.load(event.params.owner.toHexString());
    if (!user) {
        user = new User(event.transaction.from.toHexString());
        user.save();
    }
}

export function handleUnlistedNFT(event: NFTUnlistedEvent): void {
    let token = Token.load(event.params.tokenId.toString());
    if (!token) {
        token = new Token(event.params.tokenId.toString());
        token.tokenID = event.params.tokenId;
    }
    token.creator = event.params.unlistSender.toHexString();
    token.save();

    let user = User.load(event.params.unlistSender.toHexString());
    if (!user) {
        user = new User(event.transaction.from.toHexString());
        user.save();
    }
}
