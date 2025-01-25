import { forwardRef, Module } from '@nestjs/common';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Promotion, PromotionSchema } from './promotion.schema';
import { Booking, BookingSchema } from 'src/booking/booking.schema';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Promotion.name,
        schema: PromotionSchema,
      },
      {
        name: Booking.name,
        schema: BookingSchema,
      },
    ]),
    forwardRef(() => BookingModule),
  ],
})
export class PromotionModule {}
