import mongoose from 'mongoose';
import { Booking } from 'src/booking/booking.schema';
export declare class Payment {
    booking_id: Booking;
    amount: number;
    payment_method: string;
    paymentCode: string;
    paymentDate: Date;
}
export declare const PaymentSchema: mongoose.Schema<Payment, mongoose.Model<Payment, any, any, any, mongoose.Document<unknown, any, Payment> & Payment & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Payment, mongoose.Document<unknown, {}, mongoose.FlatRecord<Payment>> & mongoose.FlatRecord<Payment> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
