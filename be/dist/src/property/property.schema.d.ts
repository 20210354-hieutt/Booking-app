import mongoose from 'mongoose';
import { User } from 'src/user/user.schema';
import { TYPE } from './enum/type.enum';
export declare class Property {
    owner_id: User;
    name: string;
    description: string;
    address: {
        province: string;
        district: string;
        ward: string;
        street: string;
    };
    location: {
        longitude: number;
        latitude: number;
    };
    property_type: TYPE;
    rate: number;
    images: string[];
}
export declare const PropertySchema: mongoose.Schema<Property, mongoose.Model<Property, any, any, any, mongoose.Document<unknown, any, Property> & Property & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Property, mongoose.Document<unknown, {}, mongoose.FlatRecord<Property>> & mongoose.FlatRecord<Property> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
