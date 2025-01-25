import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Promotion } from './promotion.schema';
import { Model, ObjectId } from 'mongoose';
import { CreatePromotionDto } from './dto/createPromotion.dto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectModel(Promotion.name)
    private readonly promotionSchema: Model<Promotion>,
  ) {}
  async getAllPromotion() {
    return await this.promotionSchema.find();
  }
  async createPromotion(createPromotionDto: CreatePromotionDto) {
    const newPromotion = new this.promotionSchema(createPromotionDto);
    return await newPromotion.save();
  }
  async getPromotionById(id: ObjectId) {
    return await this.promotionSchema.findById(id);
  }
  async deletePromotionById(id: ObjectId) {
    return await this.promotionSchema.findByIdAndDelete(id);
  }
  async findRoomPromotionForBooking(roomId: ObjectId) {
    const findPromotion = await this.promotionSchema.findOne({
      roomId: {
        $in: [roomId],
      },
    });
    return findPromotion;
  }
  async findPropertyPromotionForBooking(propertyId: ObjectId) {
    const findPromotion = await this.promotionSchema.findOne({
      propertyId: {
        $in: [propertyId],
      },
    });
    return findPromotion;
  }
}
