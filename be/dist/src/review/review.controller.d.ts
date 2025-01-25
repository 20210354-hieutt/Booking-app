import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/createReview.dto';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    createReview(createReviewDto: CreateReviewDto): Promise<import("mongoose").Document<unknown, {}, import("../room/room.schema").Room> & import("../room/room.schema").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    findReviewWithProperty(property_id: string, page: number): Promise<{
        reviews: (import("mongoose").Document<unknown, {}, import("./review.schema").Review> & import("./review.schema").Review & {
            _id: import("mongoose").Types.ObjectId;
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
    getMonthlyRating(id: any): Promise<{
        [key: number]: number;
    }>;
    getMonthlyRatingByProperty(id: any): Promise<{
        [key: number]: number;
    }>;
    getReviewByRate(property_id: string, data: any, page: number): Promise<{
        reviews: (import("mongoose").Document<unknown, {}, import("./review.schema").Review> & import("./review.schema").Review & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        })[];
        totalPages: number;
        currentPage: number;
    }>;
    getReviewByType(property_id: string, data: any, page: number): Promise<{
        reviews: (import("mongoose").Document<unknown, {}, import("./review.schema").Review> & import("./review.schema").Review & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        })[];
        totalPages: number;
        currentPage: number;
    }>;
}
