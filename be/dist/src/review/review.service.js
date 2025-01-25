"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const review_schema_1 = require("./review.schema");
const mongoose_2 = __importStar(require("mongoose"));
const property_schema_1 = require("../property/property.schema");
const room_schema_1 = require("../room/room.schema");
let ReviewService = class ReviewService {
    constructor(reviewSchema, propertySchema, roomSchema) {
        this.reviewSchema = reviewSchema;
        this.propertySchema = propertySchema;
        this.roomSchema = roomSchema;
    }
    async createReview(createReviewDto) {
        const newReview = new this.reviewSchema(createReviewDto);
        const savedReview = await newReview.save();
        const findRoom = await this.roomSchema
            .findById(createReviewDto.roomId)
            .populate('property_id');
        const findProperty = await this.propertySchema.findById(findRoom.property_id);
        if (findProperty.rate === 0) {
            const updateProperty = await this.propertySchema.findByIdAndUpdate(findProperty._id, {
                $set: {
                    rate: savedReview.rating,
                },
            });
            await updateProperty.save();
        }
        else {
            const oldRating = findProperty.rate;
            const newRating = (oldRating + savedReview.rating) / 2;
            const roundedRating = Math.round(newRating * 10) / 10;
            const updateProperty = await this.propertySchema.findByIdAndUpdate(findProperty._id, {
                $set: {
                    rate: roundedRating,
                },
            });
            await updateProperty.save();
        }
        if (findRoom.rating === 0) {
            const updateRoom = await this.roomSchema.findByIdAndUpdate(findRoom._id, {
                $set: {
                    rating: savedReview.rating,
                },
            });
            return updateRoom.save();
        }
        else {
            const oldRating = findProperty.rate;
            const newRating = (oldRating + savedReview.rating) / 2;
            const roundedRating = Math.round(newRating * 10) / 10;
            const updateRoom = await this.roomSchema.findByIdAndUpdate(findRoom._id, {
                $set: {
                    rating: roundedRating,
                },
            });
            return updateRoom.save();
        }
    }
    async findReviewWithProperty(property_id, page = 1, limit = 10) {
        const countReviewsType = {};
        const rooms = await this.roomSchema.find({ property_id });
        const countReviewsRate = [
            {
                type: 'Awful',
                count: 0,
            },
            {
                type: 'Bad',
                count: 0,
            },
            {
                type: 'Normal',
                count: 0,
            },
            {
                type: 'Good',
                count: 0,
            },
            {
                type: 'Excellent',
                count: 0,
            },
        ];
        const roomIds = rooms.map((room) => room._id);
        const skip = (page - 1) * limit;
        const totalReviews = await this.reviewSchema
            .find({ roomId: { $in: roomIds } })
            .populate('userId')
            .populate('roomId')
            .exec();
        await Promise.all(totalReviews.map((review) => {
            if (review.rating < 5 && review.rating >= 4) {
                countReviewsRate[4].count++;
            }
            else if (review.rating < 4 && review.rating >= 3) {
                countReviewsRate[3].count++;
            }
            else if (review.rating >= 2 && review.rating < 3) {
                countReviewsRate[2].count++;
            }
            else if (review.rating >= 1 && review.rating < 2) {
                countReviewsRate[1].count++;
            }
            else if (review.rating >= 0 && review.rating < 1) {
                countReviewsRate[0].count++;
            }
            if (countReviewsType[review.review_type]) {
                countReviewsType[review.review_type].count++;
                countReviewsType[review.review_type].totalRating += review.rating;
            }
            else {
                countReviewsType[review.review_type] = {
                    count: 1,
                    totalRating: review.rating,
                };
            }
        }));
        const averageRatingsByType = {};
        for (const [reviewType, stats] of Object.entries(countReviewsType)) {
            averageRatingsByType[reviewType] = stats.totalRating / stats.count;
        }
        const reviews = await this.reviewSchema
            .find({ roomId: { $in: roomIds } })
            .sort({ rating: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId')
            .populate('roomId')
            .exec();
        const reviewCount = await this.reviewSchema
            .countDocuments({ roomId: { $in: roomIds } })
            .exec();
        return {
            reviews,
            totalPages: Math.ceil(reviewCount / limit),
            currentPage: page,
            countReviewsRate,
            countReviewsType,
            averageRatingsByType,
        };
    }
    async countReviewWithProperty(property_id) {
        const rooms = await this.roomSchema.find({ property_id });
        const roomIds = rooms.map((room) => room._id);
        return this.reviewSchema
            .countDocuments({ room_id: { $in: roomIds } })
            .exec();
    }
    async getMonthlyRating(owner_id) {
        const reviews = await this.reviewSchema
            .find()
            .populate({
            path: 'roomId',
            populate: {
                path: 'property_id',
                match: { owner_id: new mongoose_2.default.Types.ObjectId(owner_id) },
            },
        })
            .exec();
        const validReviews = reviews.filter((review) => review.roomId?.property_id !== null);
        const ratingCounts = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        };
        validReviews.forEach((review) => {
            const roundedRating = Math.ceil(review.rating);
            ratingCounts[roundedRating] = (ratingCounts[roundedRating] || 0) + 1;
        });
        return ratingCounts;
    }
    async getMonthlyRatingByProperty(property_id) {
        const reviews = await this.reviewSchema
            .find()
            .populate({
            path: 'roomId',
            populate: {
                path: 'property_id',
                match: { _id: new mongoose_2.default.Types.ObjectId(property_id) },
            },
        })
            .exec();
        const validReviews = reviews.filter((review) => review.roomId?.property_id !== null);
        const ratingCounts = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        };
        validReviews.forEach((review) => {
            const roundedRating = Math.ceil(review.rating);
            ratingCounts[roundedRating] = (ratingCounts[roundedRating] || 0) + 1;
        });
        return ratingCounts;
    }
    async getReviewByType(property_id, review_type, page = 1, limit = 10) {
        const rooms = await this.roomSchema.find({ property_id });
        const roomIds = rooms.map((room) => room._id);
        const skip = (page - 1) * limit;
        const reviews = await this.reviewSchema
            .find({ roomId: { $in: roomIds }, review_type })
            .sort({ rating: -1 })
            .skip(skip)
            .populate('userId')
            .populate('roomId')
            .exec();
        const reviewCount = await this.reviewSchema
            .countDocuments({ roomId: { $in: roomIds }, review_type })
            .exec();
        return {
            reviews,
            totalPages: Math.ceil(reviewCount / limit),
            currentPage: page,
        };
    }
    async getReviewByRate(property_id, min, max, page = 1, limit = 10) {
        const rooms = await this.roomSchema.find({ property_id });
        const roomIds = rooms.map((room) => room._id);
        const skip = (page - 1) * limit;
        const reviews = await this.reviewSchema
            .find({
            roomId: { $in: roomIds },
            $and: [
                {
                    rating: { $gte: min },
                },
                {
                    rating: { $lte: max },
                },
            ],
        })
            .skip(skip)
            .populate('userId')
            .populate('roomId')
            .exec();
        const reviewCount = await this.reviewSchema
            .countDocuments({
            roomId: { $in: roomIds },
            $and: [
                {
                    rating: { $gte: min },
                },
                {
                    rating: { $lte: max },
                },
            ],
        })
            .exec();
        return {
            reviews,
            totalPages: Math.ceil(reviewCount / limit),
            currentPage: page,
        };
    }
    async getReviewByRateAndType(property_id, review_type, min, max, page = 1, limit = 10) {
        const rooms = await this.roomSchema.find({ property_id });
        const roomIds = rooms.map((room) => room._id);
        const skip = (page - 1) * limit;
        if (min && max && !review_type) {
            const reviews = await this.reviewSchema
                .find({
                roomId: { $in: roomIds },
                $and: [
                    {
                        rating: { $gte: min },
                    },
                    {
                        rating: { $lte: max },
                    },
                ],
            })
                .skip(skip)
                .populate('userId')
                .populate('roomId')
                .exec();
            const reviewCount = await this.reviewSchema
                .countDocuments({
                roomId: { $in: roomIds },
                $and: [
                    {
                        rating: { $gte: min },
                    },
                    {
                        rating: { $lte: max },
                    },
                ],
            })
                .exec();
            return {
                reviews,
                totalPages: Math.ceil(reviewCount / limit),
                currentPage: page,
            };
        }
        else if ((!min && !max) || (min === 0 && max === 0 && review_type)) {
            const reviews = await this.reviewSchema
                .find({ roomId: { $in: roomIds }, review_type })
                .sort({ rating: -1 })
                .skip(skip)
                .populate('userId')
                .populate('roomId')
                .exec();
            const reviewCount = await this.reviewSchema
                .countDocuments({ roomId: { $in: roomIds }, review_type })
                .exec();
            return {
                reviews,
                totalPages: Math.ceil(reviewCount / limit),
                currentPage: page,
            };
        }
        else {
            console.log(min);
            console.log(max);
            const reviews = await this.reviewSchema
                .find({
                roomId: { $in: roomIds },
                review_type,
                $and: [
                    {
                        rating: { $gte: min },
                    },
                    {
                        rating: { $lte: max },
                    },
                ],
            })
                .sort({ rating: -1 })
                .skip(skip)
                .populate('userId')
                .populate('roomId')
                .exec();
            const reviewCount = await this.reviewSchema
                .countDocuments({
                roomId: { $in: roomIds },
                review_type,
                $and: [
                    {
                        rating: { $gte: min },
                    },
                    {
                        rating: { $lte: max },
                    },
                ],
            })
                .exec();
            return {
                reviews,
                totalPages: Math.ceil(reviewCount / limit),
                currentPage: page,
            };
        }
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __param(1, (0, mongoose_1.InjectModel)(property_schema_1.Property.name)),
    __param(2, (0, mongoose_1.InjectModel)(room_schema_1.Room.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ReviewService);
//# sourceMappingURL=review.service.js.map