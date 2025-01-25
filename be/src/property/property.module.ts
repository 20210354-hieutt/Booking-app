import { forwardRef, Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from './property.schema';
import { BookingService } from 'src/booking/booking.service';
import { BookingModule } from 'src/booking/booking.module';
import { Booking, BookingSchema } from 'src/booking/booking.schema';
import { SessionModule } from 'src/session/session.module';
import { Session } from 'inspector/promises';
import { SessionSchema } from 'src/session/session.schema';
import { SessionService } from 'src/session/session.service';
import { JwtModule } from '@nestjs/jwt';
import { RoomService } from 'src/room/room.service';
import { RoomModule } from 'src/room/room.module';
import { Room, RoomSchema } from 'src/room/room.schema';
import { ReviewModule } from 'src/review/review.module';
import { Review, ReviewSchema } from 'src/review/review.schema';
import { User, UserSchema } from 'src/user/user.schema';
import { UserModule } from 'src/user/user.module';
import { ReviewService } from 'src/review/review.service';
import { Promotion, PromotionSchema } from 'src/promotion/promotion.schema';
import { PromotionModule } from 'src/promotion/promotion.module';
import { NotificationGateway } from 'src/notification/notification/notification.gateway';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationService } from 'src/notification/notification.service';
import {
  Notification,
  NotificationSchema,
} from 'src/notification/notification.schema';
import { GmailModule } from 'src/gmail/gmail.module';
import { GmailService } from 'src/gmail/gmail.service';
const jwtConstant = {
  secret: 'jwtsecret',
};
@Module({
  controllers: [PropertyController],
  providers: [
    PropertyService,
    BookingService,
    SessionService,
    RoomService,
    ReviewService,
    NotificationGateway,
    NotificationService,
    GmailService,
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: Property.name,
        schema: PropertySchema,
      },
      {
        name: Promotion.name,
        schema: PromotionSchema,
      },
      {
        name: Booking.name,
        schema: BookingSchema,
      },
      {
        name: Session.name,
        schema: SessionSchema,
      },
      { name: Room.name, schema: RoomSchema },
      { name: Review.name, schema: ReviewSchema },
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    forwardRef(() => BookingModule),
    forwardRef(() => SessionModule),
    forwardRef(() => RoomModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => GmailModule),

    ReviewModule,
    UserModule,
    PromotionModule,
    JwtModule.register({
      secret: jwtConstant.secret,

      signOptions: { expiresIn: '60m' },
    }),
  ],
})
export class PropertyModule {}
