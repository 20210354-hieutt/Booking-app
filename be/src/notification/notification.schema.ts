import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Booking } from 'src/booking/booking.schema';
import { User } from 'src/user/user.schema';
@Schema()
export class Notification {
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender_id: User;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  receiver_id: User;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  })
  booking_id: Booking;

  @Prop({
    required: true,
    enum: ['Booking', 'Payment', 'Partner'],
    default: 'Booking',
  })
  type: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  status: boolean;
  @Prop({ default: Date.now })
  created_at: Date;
  @Prop({
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })
  expires_at: Date;
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ receiver_id: 1 });
NotificationSchema.index({ partner_id: 1 });
NotificationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
