import { ObjectId } from 'mongoose';

export class CreateReviewDto {
  userId: ObjectId;
  roomId: ObjectId;
  rating: number;
  review_text: string;
  review_type: string;
}
