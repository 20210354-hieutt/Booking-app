import mongoose from 'mongoose';
import { Booking } from 'src/booking/booking.schema';
import { Property } from 'src/property/property.schema';
import { User } from 'src/user/user.schema';
export declare class Session {
    userId: User;
    lastViewProperties: Property[];
    lastBooking: Booking[];
    recent_search: {
        province: string;
        check_in: Date;
        check_out: Date;
        capacity: {
            adults: number;
            childs: {
                age: number;
                count: number;
            };
            room: number;
        };
    }[];
    uid: string;
    last_activity: Date;
    expires_at: Date;
    refreshToken: string;
}
declare const SessionSchema: mongoose.Schema<Session, mongoose.Model<Session, any, any, any, mongoose.Document<unknown, any, Session> & Session & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Session, mongoose.Document<unknown, {}, mongoose.FlatRecord<Session>> & mongoose.FlatRecord<Session> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
export { SessionSchema };
