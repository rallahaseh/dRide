import { utils } from "ethers";
import { getProvider } from '@wagmi/core'
import { signTypedData } from '@wagmi/core'
import crypto from "crypto";

const createERC721PermitSignature = async (
    owner: string,
    spender: string,
    amount: number,
    tokenAddress: string
) => {
    try {
        const transactionDeadline = Date.now() + 20 * 60;
        const nonce = `0x${crypto.randomBytes(8).toString("hex")}`
        const permit = [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
        ];
        const ownerAddress = owner.slice(2)
        const spenderAddress = spender.slice(2)
        const _tokenAddress = tokenAddress.slice(2)
        const provider = getProvider()
        const domain = {
            name: "dRide Application | Permit of using USDC",
            version: '1',
            chainId: provider.network.chainId,
            verifyingContract: `0x${_tokenAddress}`,
        } as const
        const types = {
            permit,
        } as const
        const value = {
            owner: ownerAddress,
            spender: spenderAddress,
            amount: amount,
            nonce: nonce.toString(),
            deadline: transactionDeadline
        } as const
        const signature = await signTypedData({
            domain,
            types,
            value
        })
        if (!signature) return
        const signData = utils.splitSignature(signature);
        const { r, s, v } = signData;
        return {
            r,
            s,
            v,
            transactionDeadline,
        };
    } catch (e) {
        throw Error(`${e}`);
    }
};

export default createERC721PermitSignature;