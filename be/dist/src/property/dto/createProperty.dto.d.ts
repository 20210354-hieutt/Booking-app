import { ObjectId } from 'mongoose';
export declare class CreatePropertyDto {
    owner_id: ObjectId;
    name: string;
    description: string;
    address: {
        province: string;
        district: string;
        ward: string;
        street: string;
    };
    property_type: string;
    images: string[];
    longitude: number;
    latitude: number;
    rooms: Object[];
}
