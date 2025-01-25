import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/user.schema';
import { TYPE } from './enum/type.enum';
import { Room } from 'src/room/room.schema';

@Schema()
export class Review {
  @Prop({ require: true, type: mongoose.Schema.ObjectId, ref: 'User' })
  userId: User;
  @Prop({ require: true, type: mongoose.Schema.ObjectId, ref: 'Room' })
  roomId: Room;

  @Prop({ required: true, default: 0 })
  rating: number;
  @Prop({ required: true })
  review_text: string;
  @Prop({ enum: TYPE })
  review_type: TYPE;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
