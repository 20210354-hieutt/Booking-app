import mongoose from 'mongoose';
import { Property } from 'src/property/property.schema';
import { Room } from 'src/room/room.schema';
export declare class Promotion {
    name: string;
    description: string;
    discountPercentage: number;
    startDate: Date;
    endDate: Date;
    propertyId: Property[];
    roomId: Room[];
}
export declare const PromotionSchema: mongoose.Schema<Promotion, mongoose.Model<Promotion, any, any, any, mongoose.Document<unknown, any, Promotion> & Promotion & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Promotion, mongoose.Document<unknown, {}, mongoose.FlatRecord<Promotion>> & mongoose.FlatRecord<Promotion> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
