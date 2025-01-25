import { Promotion } from './promotion.schema';
import { Model, ObjectId } from 'mongoose';
import { CreatePromotionDto } from './dto/createPromotion.dto';
export declare class PromotionService {
    private readonly promotionSchema;
    constructor(promotionSchema: Model<Promotion>);
    getAllPromotion(): Promise<(import("mongoose").Document<unknown, {}, Promotion> & Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    createPromotion(createPromotionDto: CreatePromotionDto): Promise<import("mongoose").Document<unknown, {}, Promotion> & Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getPromotionById(id: ObjectId): Promise<import("mongoose").Document<unknown, {}, Promotion> & Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    deletePromotionById(id: ObjectId): Promise<import("mongoose").Document<unknown, {}, Promotion> & Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    findRoomPromotionForBooking(roomId: ObjectId): Promise<import("mongoose").Document<unknown, {}, Promotion> & Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    findPropertyPromotionForBooking(propertyId: ObjectId): Promise<import("mongoose").Document<unknown, {}, Promotion> & Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
