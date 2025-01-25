import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './review.schema';
import mongoose, { Model } from 'mongoose';
import { CreateReviewDto } from './dto/createReview.dto';
import { Property } from 'src/property/property.schema';
import { Room } from 'src/room/room.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewSchema: Model<Review>,
    @InjectModel(Property.name)
    private readonly propertySchema: Model<Property>,
    @InjectModel(Room.name)
    private readonly roomSchema: Model<Room>,
  ) {}
  async createReview(createReviewDto: CreateReviewDto) {
    const newReview = new this.reviewSchema(createReviewDto);
    const savedReview = await newReview.save();
    const findRoom = await this.roomSchema
      .findById(createReviewDto.roomId)
      .populate('property_id');
    const findProperty = await this.propertySchema.findById(
      findRoom.property_id,
    );
    if (findProperty.rate === 0) {
      const updateProperty = await this.propertySchema.findByIdAndUpdate(
        findProperty._id,
        {
          $set: {
            rate: savedReview.rating,
          },
        },
      );
      await updateProperty.save();
    } else {
      const oldRating = findProperty.rate;
      const newRating = (oldRating + savedReview.rating) / 2;
      const roundedRating = Math.round(newRating * 10) / 10;
      const updateProperty = await this.propertySchema.findByIdAndUpdate(
        findProperty._id,
        {
          $set: {
            rate: roundedRating,
          },
        },
      );

      await updateProperty.save();
    }

    if (findRoom.rating === 0) {
      const updateRoom = await this.roomSchema.findByIdAndUpdate(findRoom._id, {
        $set: {
          rating: savedReview.rating,
        },
      });

      return updateRoom.save();
    } else {
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

  async findReviewWithProperty(
    property_id: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const countReviewsType: Record<
      string,
      { count: number; totalRating: number }
    > = {};
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
    await Promise.all(
      totalReviews.map((review) => {
        if (review.rating < 5 && review.rating >= 4) {
          countReviewsRate[4].count++;
        } else if (review.rating < 4 && review.rating >= 3) {
          countReviewsRate[3].count++;
        } else if (review.rating >= 2 && review.rating < 3) {
          countReviewsRate[2].count++;
        } else if (review.rating >= 1 && review.rating < 2) {
          countReviewsRate[1].count++;
        } else if (review.rating >= 0 && review.rating < 1) {
          countReviewsRate[0].count++;
        }

        if (countReviewsType[review.review_type]) {
          countReviewsType[review.review_type].count++;
          countReviewsType[review.review_type].totalRating += review.rating;
        } else {
          countReviewsType[review.review_type] = {
            count: 1,
            totalRating: review.rating,
          };
        }
      }),
    );
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
  async countReviewWithProperty(property_id: string) {
    const rooms = await this.roomSchema.find({ property_id });
    const roomIds = rooms.map((room) => room._id);
    return this.reviewSchema
      .countDocuments({ room_id: { $in: roomIds } })
      .exec();
  }
  async getMonthlyRating(owner_id: string) {
    const reviews = await this.reviewSchema
      .find()
      .populate({
        path: 'roomId',
        populate: {
          path: 'property_id',
          match: { owner_id: new mongoose.Types.ObjectId(owner_id) },
        },
      })
      .exec();

    const validReviews = reviews.filter(
      (review) => review.roomId?.property_id !== null,
    );

    const ratingCounts: { [key: number]: number } = {
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
  async getMonthlyRatingByProperty(property_id: string) {
    const reviews = await this.reviewSchema
      .find()
      .populate({
        path: 'roomId',
        populate: {
          path: 'property_id',
          match: { _id: new mongoose.Types.ObjectId(property_id) },
        },
      })
      .exec();

    const validReviews = reviews.filter(
      (review) => review.roomId?.property_id !== null,
    );

    const ratingCounts: { [key: number]: number } = {
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
  async getReviewByType(
    property_id: string,
    review_type: string,
    page: number = 1,
    limit: number = 10,
  ) {
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
  async getReviewByRate(
    property_id: string,
    min: number,
    max: number,
    page: number = 1,
    limit: number = 10,
  ) {
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
  async getReviewByRateAndType(
    property_id: string,
    review_type: string,
    min: number,
    max: number,
    page: number = 1,
    limit: number = 10,
  ) {
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
    } else if ((!min && !max) || (min === 0 && max === 0 && review_type)) {
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
    } else {
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
}
