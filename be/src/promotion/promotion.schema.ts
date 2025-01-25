import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Booking } from 'src/booking/booking.schema';
import { Property } from 'src/property/property.schema';
import { Room } from 'src/room/room.schema';

@Schema()
export class Promotion {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Number, required: true })
  discountPercentage: number;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Property',
  })
  propertyId: Property[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Room',
  })
  roomId: Room[];
}
export const PromotionSchema = SchemaFactory.createForClass(Promotion);
