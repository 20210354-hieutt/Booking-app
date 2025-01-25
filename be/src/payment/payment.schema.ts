import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Booking } from 'src/booking/booking.schema';
import { PaymentMethod } from './enum/paymentMethod.enum';

@Schema()
export class Payment {
  @Prop({ required: true, type: mongoose.Schema.ObjectId, ref: 'Booking' })
  booking_id: Booking;
  @Prop({ required: true })
  amount: number;
  @Prop({ required: true })
  payment_method: string;
  @Prop({ require: true })
  paymentCode: string;
  @Prop({ require: true, type: Date })
  paymentDate: Date;
}
export const PaymentSchema = SchemaFactory.createForClass(Payment);
