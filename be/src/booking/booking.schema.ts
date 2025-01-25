import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Room } from 'src/room/room.schema';
import { User } from 'src/user/user.schema';
import { BookingStatus } from './enum/bookingStatus.enum';
import { PaymentStatus } from './enum/paymentStatus.enum';
import { Property } from 'src/property/property.schema';

@Schema()
export class Booking {
  @Prop({ required: true, type: mongoose.Schema.ObjectId, ref: 'User' })
  user_id: User;
  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.ObjectId, ref: 'Room' }],
  })
  room_id: Room[];
  @Prop({ required: true, type: mongoose.Schema.ObjectId, ref: 'Property' })
  property: Property;
  @Prop({ required: true, type: Date })
  check_in_date: Date;
  @Prop({ required: true, type: Date })
  check_out_date: Date;
  @Prop({
    required: true,
    type: {
      adults: {
        type: Number,
      },
      childs: {
        count: Number,
        age: Number,
      },
      room: {
        type: Number,
      },
    },
  })
  capacity: {
    adults: number;
    childs: {
      count: number;
      age: number;
    };
    room: number;
  };
  @Prop({ required: false })
  total_price: number;
  @Prop({
    required: true,
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  booking_status: BookingStatus;
  @Prop({
    required: true,
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  payment_status: PaymentStatus;
  @Prop({})
  request: string;
}
export const BookingSchema = SchemaFactory.createForClass(Booking);
