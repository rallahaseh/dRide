import { Bytes, ethers } from "ethers";

export const stringToBytes32 = (text: string) => {
    return ethers.utils.formatBytes32String(text);
};

export const bytes32ToString = (bytes32: Bytes) => {
    return ethers.utils.parseBytes32String(bytes32);
};