import mongoose from 'mongoose';
import { Room } from 'src/room/room.schema';
import { User } from 'src/user/user.schema';
import { BookingStatus } from './enum/bookingStatus.enum';
import { PaymentStatus } from './enum/paymentStatus.enum';
import { Property } from 'src/property/property.schema';
export declare class Booking {
    user_id: User;
    room_id: Room[];
    property: Property;
    check_in_date: Date;
    check_out_date: Date;
    capacity: {
        adults: number;
        childs: {
            count: number;
            age: number;
        };
        room: number;
    };
    total_price: number;
    booking_status: BookingStatus;
    payment_status: PaymentStatus;
    request: string;
}
export declare const BookingSchema: mongoose.Schema<Booking, mongoose.Model<Booking, any, any, any, mongoose.Document<unknown, any, Booking> & Booking & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Booking, mongoose.Document<unknown, {}, mongoose.FlatRecord<Booking>> & mongoose.FlatRecord<Booking> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
