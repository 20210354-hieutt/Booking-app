import mongoose from 'mongoose';
import { Booking } from 'src/booking/booking.schema';
import { User } from 'src/user/user.schema';
export declare class Notification {
    sender_id: User;
    receiver_id: User;
    booking_id: Booking;
    type: string;
    message: string;
    status: boolean;
    created_at: Date;
    expires_at: Date;
}
export declare const NotificationSchema: mongoose.Schema<Notification, mongoose.Model<Notification, any, any, any, mongoose.Document<unknown, any, Notification> & Notification & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Notification, mongoose.Document<unknown, {}, mongoose.FlatRecord<Notification>> & mongoose.FlatRecord<Notification> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
