import mongoose from 'mongoose';
import { User } from 'src/user/user.schema';
import { TYPE } from './enum/type.enum';
import { Room } from 'src/room/room.schema';
export declare class Review {
    userId: User;
    roomId: Room;
    rating: number;
    review_text: string;
    review_type: TYPE;
}
export declare const ReviewSchema: mongoose.Schema<Review, mongoose.Model<Review, any, any, any, mongoose.Document<unknown, any, Review> & Review & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Review, mongoose.Document<unknown, {}, mongoose.FlatRecord<Review>> & mongoose.FlatRecord<Review> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
