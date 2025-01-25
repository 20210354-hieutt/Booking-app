import { Booking } from './booking.schema';
import mongoose, { Model, Types } from 'mongoose';
import { Session } from 'src/session/session.schema';
import { SessionService } from 'src/session/session.service';
import { Promotion } from 'src/promotion/promotion.schema';
import { Room } from 'src/room/room.schema';
import { PromotionService } from 'src/promotion/promotion.service';
import { NotificationGateway } from 'src/notification/notification/notification.gateway';
import { NotificationService } from 'src/notification/notification.service';
import { GmailService } from 'src/gmail/gmail.service';
export declare class BookingService {
    private readonly bookingSchema;
    private readonly sessionSchema;
    private readonly sessionService;
    private readonly promotionSchema;
    private readonly roomSchema;
    private readonly promotionService;
    private readonly notificationGateway;
    private readonly notificationService;
    private readonly gmailService;
    constructor(bookingSchema: Model<Booking>, sessionSchema: Model<Session>, sessionService: SessionService, promotionSchema: Model<Promotion>, roomSchema: Model<Room>, promotionService: PromotionService, notificationGateway: NotificationGateway, notificationService: NotificationService, gmailService: GmailService);
    getBookingById(booking_id: string): Promise<any[]>;
    cancelBooking(booking_id: string): Promise<void>;
    finalizeCancellation(bookingId: string): Promise<boolean>;
    calculateTotalNightPriceForReservation(booking: any): Promise<number>;
    calculateTotalNightPrice(booking: any): Promise<number>;
    createBookingWithAdmin(createBookingDto: any): Promise<mongoose.Document<unknown, {}, Booking> & Booking & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }>;
    createBooking(createBookingDto: any): Promise<mongoose.Document<unknown, {}, Booking> & Booking & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }>;
    checkFullRoom(room_id: string): Promise<boolean>;
    findConflictingBookings(property: mongoose.Types.ObjectId, roomId: mongoose.Types.ObjectId, check_in: Date, check_out: Date): Promise<string[]>;
    getMonthlyRevenueByOwner(owner_id: string): Promise<any[]>;
    getMonthlyRevenueByProperty(propety_id: string): Promise<any[]>;
    getBookingByOwner(owner_id: string): Promise<any[]>;
    updateBookingStatus(bookingId: string, data: any): Promise<mongoose.Document<unknown, {}, Booking> & Booking & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }>;
    findUnfinishedBooking(userId: string): Promise<any[]>;
    getAllBooking(): Promise<(mongoose.Document<unknown, {}, Booking> & Booking & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    deleteBookingById(bookingId: string): Promise<mongoose.Document<unknown, {}, Booking> & Booking & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }>;
    updateBookingById(bookingId: string, bookingDto: any): Promise<mongoose.Document<unknown, {}, Booking> & Booking & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getCompletedAndCancelledBookingByUser(userId: string): Promise<(mongoose.Document<unknown, {}, Booking> & Booking & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getById(bookingId: string): Promise<mongoose.Document<unknown, {}, Booking> & Booking & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
