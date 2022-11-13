import { useCallback, useMemo, useState } from 'react';
import { NFTStorage } from 'nft.storage';

import type { CIDString } from 'nft.storage';
import { Metadata as IMetadata, Parameters } from '../libraries/metadata';
import type { CheckResult, StatusResult } from 'nft.storage/src/lib/interface';

const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY as string;

export interface Metadata {
    vehicle: {
        brand: string;
        model: string;
        type: string;
        year: string;
    }
    date: {
        from?: number,
        to?: number
    };
    location: {
        latitude?: number,
        longitude?: number,
        name?: string
    };
    price: number;
    thumbnail: File;
}

export const useNFTStorage = () => {
    const [isStoreLoading, setIsStoreLoading] = useState<boolean>(false);
    const [isCheckLoading, setIsCheckLoading] = useState<boolean>(false);
    const [isStatusLoading, setIsStatusLoading] = useState<boolean>(false);

    const nftStorage = useMemo<NFTStorage>(() => {
        return new NFTStorage({ token: NFT_STORAGE_KEY });
    }, []);

    const store = useCallback<(metadata: Parameters) => Promise<CIDString | undefined>>(
        async (metadata: Parameters) => {
            setIsStoreLoading(true);
            const cid = await nftStorage.storeDirectory(new IMetadata(metadata).toFilesSource());
            setIsStoreLoading(false);
            return cid;
        },
        [nftStorage]
    );

    const check = useCallback<(cid: string) => Promise<CheckResult>>(
        async (cid: string) => {
            setIsCheckLoading(true);
            const checkResult = await nftStorage.check(cid);
            setIsCheckLoading(false);
            return checkResult;
        },
        [nftStorage]
    );

    const status = useCallback<(cid: string) => Promise<StatusResult>>(
        async (cid: string) => {
            setIsStatusLoading(true);
            const statusResult = await nftStorage.status(cid);
            setIsStatusLoading(false);
            return statusResult;
        },
        [nftStorage]
    );

    return { store, check, status, isStoreLoading, isCheckLoading, isStatusLoading };
};
