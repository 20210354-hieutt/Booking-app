import { Room } from './room.schema';
import mongoose, { Model, ObjectId, Types } from 'mongoose';
import { CreateRoomDto } from './dto/createRoom.dto';
import { FindRoomDto } from './dto/findRoom.dto';
import { Review } from 'src/review/review.schema';
import { BookingService } from 'src/booking/booking.service';
import { Property } from 'src/property/property.schema';
import { Session } from 'src/session/session.schema';
import { Booking } from 'src/booking/booking.schema';
export declare class RoomService {
    private readonly roomSchema;
    private readonly propertySchema;
    private readonly reviewSchema;
    private readonly bookingService;
    private readonly sessionSchema;
    private readonly bookingSchema;
    constructor(roomSchema: Model<Room>, propertySchema: Model<Property>, reviewSchema: Model<Review>, bookingService: BookingService, sessionSchema: Model<Session>, bookingSchema: Model<Booking>);
    createRoom(createRoomDto: CreateRoomDto): Promise<mongoose.Document<unknown, {}, Room> & Room & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }>;
    updateRoom(room: any): Promise<any>;
    deleteRoom(id: ObjectId): Promise<mongoose.Document<unknown, {}, Room> & Room & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }>;
    countRoomWithPropety(property_id: mongoose.Types.ObjectId): Promise<number>;
    getAllRoomWithDetails(): Promise<(mongoose.Document<unknown, {}, Room> & Room & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getRoomWithPriceByProperty(property_id: any, check_out: any, check_in: any): Promise<any[]>;
    getAllRoomWithTotalPrice({ check_in, check_out, capacity, userId, place, }: {
        check_in: any;
        check_out: any;
        capacity: any;
        userId: any;
        place: any;
    }): Promise<any[]>;
    getRoomWithProperty(property_id: ObjectId): Promise<(mongoose.Document<unknown, {}, Room> & Room & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    findAvailableRoomWithProperty(property_id: mongoose.Types.ObjectId): Promise<(mongoose.Document<unknown, {}, Room> & Room & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    isDuplicateSearch(recentSearch: any[], newSearch: any): Promise<boolean>;
    findAvailableRoomWithSearch(userId: string, place: string, check_in: any, check_out: any, capacity: any, type: string): Promise<any[]>;
    findConflictingInBookings(room_id: mongoose.Types.ObjectId, property_id: mongoose.Types.ObjectId, check_in: Date, check_out: Date): Promise<string[]>;
    findRoom(findRoomDto: FindRoomDto): Promise<(mongoose.Document<unknown, {}, Room> & Room & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    updateImageForRoom(roomId: any, image: any): Promise<mongoose.Document<unknown, {}, Room> & Room & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getMonthlyOccupancyRatesByOwner(ownerId: Types.ObjectId, year: number): Promise<{
        month: number;
        occupancyRate: number;
    }[]>;
    getMonthlyOccupancyRatesByProperty(property_id: Types.ObjectId, year: number): Promise<{
        month: number;
        occupancyRate: number;
    }[]>;
    findRoomInReservation(property_id: string, capacity: any, check_in_date: Date, check_out_date: Date): Promise<any[]>;
    getRoomById(roomId: string): Promise<mongoose.Document<unknown, {}, Room> & Room & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
