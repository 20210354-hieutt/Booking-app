import { Review } from './review.schema';
import mongoose, { Model } from 'mongoose';
import { CreateReviewDto } from './dto/createReview.dto';
import { Property } from 'src/property/property.schema';
import { Room } from 'src/room/room.schema';
export declare class ReviewService {
    private readonly reviewSchema;
    private readonly propertySchema;
    private readonly roomSchema;
    constructor(reviewSchema: Model<Review>, propertySchema: Model<Property>, roomSchema: Model<Room>);
    createReview(createReviewDto: CreateReviewDto): Promise<mongoose.Document<unknown, {}, Room> & Room & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    }>;
    findReviewWithProperty(property_id: string, page?: number, limit?: number): Promise<{
        reviews: (mongoose.Document<unknown, {}, Review> & Review & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v?: number;
        })[];
        totalPages: number;
        currentPage: number;
        countReviewsRate: {
            type: string;
            count: number;
        }[];
        countReviewsType: Record<string, {
            count: number;
            totalRating: number;
        }>;
        averageRatingsByType: {};
    }>;
    countReviewWithProperty(property_id: string): Promise<number>;
    getMonthlyRating(owner_id: string): Promise<{
        [key: number]: number;
    }>;
    getMonthlyRatingByProperty(property_id: string): Promise<{
        [key: number]: number;
    }>;
    getReviewByType(property_id: string, review_type: string, page?: number, limit?: number): Promise<{
        reviews: (mongoose.Document<unknown, {}, Review> & Review & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v?: number;
        })[];
        totalPages: number;
        currentPage: number;
    }>;
    getReviewByRate(property_id: string, min: number, max: number, page?: number, limit?: number): Promise<{
        reviews: (mongoose.Document<unknown, {}, Review> & Review & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v?: number;
        })[];
        totalPages: number;
        currentPage: number;
    }>;
    getReviewByRateAndType(property_id: string, review_type: string, min: number, max: number, page?: number, limit?: number): Promise<{
        reviews: (mongoose.Document<unknown, {}, Review> & Review & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v?: number;
        })[];
        totalPages: number;
        currentPage: number;
    }>;
}
