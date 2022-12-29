import { Metadata as IMetadata } from '../hooks/useNFTStorage';
import type { FilesSource } from 'nft.storage';
import { default as mime } from 'mime';

export type Parameters = IMetadata;

export class Metadata implements IMetadata {
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

    constructor({ vehicle, date, location, price, thumbnail }: IMetadata) {
        this.vehicle = vehicle;
        this.date = date;
        this.location = location;
        this.price = price;
        this.thumbnail = thumbnail;
    }

    getMetadataFile(): File {
        return new File(
            [
                JSON.stringify(
                    {
                        vehicle: this.vehicle,
                        date: this.date,
                        location: this.location,
                        price: this.price,
                        thumbnail: {
                            name: `thumbnail.${mime.getExtension(this.thumbnail.type)}`,
                            originalName: this.thumbnail.name,
                            type: this.thumbnail.type,
                            size: this.thumbnail.size,
                            datetime: this.thumbnail.lastModified
                        }
                    },
                    null,
                    2
                )
            ],
            'metadata.json'
        );
    }

    toFilesSource(): FilesSource {
        return [
            new File([this.thumbnail], `thumbnail.${mime.getExtension(this.thumbnail.type)}`),
            this.getMetadataFile()
        ];
    }
}
