import { BookingService } from './booking.service';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    createBooking(createBookingDto: any): Promise<import("mongoose").Document<unknown, {}, import("./booking.schema").Booking> & import("./booking.schema").Booking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getMonthlyRevenue(id: string): Promise<any[]>;
    getMonthlyRevenueByProperty(id: string): Promise<any[]>;
    getBookingByOwner(id: string): Promise<any[]>;
    cancelBooking(id: string): Promise<void>;
    confirmCancellation(booking_id: string, redirect: string, res: any): Promise<any>;
    findUnfinishedBooking(userId: string): Promise<any[]>;
    calculateTotalNightPriceForReservation(data: any): Promise<number>;
    updateBookingStatus(bookingId: string, data: any): Promise<import("mongoose").Document<unknown, {}, import("./booking.schema").Booking> & import("./booking.schema").Booking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getAllBooking(): Promise<(import("mongoose").Document<unknown, {}, import("./booking.schema").Booking> & import("./booking.schema").Booking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    createBookingWithAdmin(data: any): Promise<import("mongoose").Document<unknown, {}, import("./booking.schema").Booking> & import("./booking.schema").Booking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    deleteBookingById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./booking.schema").Booking> & import("./booking.schema").Booking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    updateBookingById(id: string, data: any): Promise<import("mongoose").Document<unknown, {}, import("./booking.schema").Booking> & import("./booking.schema").Booking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getCompletedAndCancelledBookingByUser(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./booking.schema").Booking> & import("./booking.schema").Booking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getRoomById(bookingId: string): Promise<import("mongoose").Document<unknown, {}, import("./booking.schema").Booking> & import("./booking.schema").Booking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
