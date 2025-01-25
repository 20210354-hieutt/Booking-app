import { ObjectId } from 'mongoose';

export class CreatePromotionDto {
  name: string;
  description: string;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
  propertyId: ObjectId[];
  roomId: ObjectId[];
}
