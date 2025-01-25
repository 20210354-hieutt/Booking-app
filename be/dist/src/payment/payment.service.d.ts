import { GmailService } from 'src/gmail/gmail.service';
import { Model } from 'mongoose';
import { Payment } from './payment.schema';
import { Booking } from 'src/booking/booking.schema';
export declare class PaymentService {
    private readonly paymentModel;
    private readonly gmailService;
    private readonly bookingSchema;
    constructor(paymentModel: Model<Payment>, gmailService: GmailService, bookingSchema: Model<Booking>);
    createPayment(data: any): Promise<{
        message: string;
    }>;
    savePayment(data: any): Promise<{
        message: string;
    }>;
    getAllPayment(): Promise<(import("mongoose").Document<unknown, {}, Payment> & Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
}
