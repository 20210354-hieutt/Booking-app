import { forwardRef, Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './review.schema';
import { Property, PropertySchema } from 'src/property/property.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RoomModule } from 'src/room/room.module';
import { Room, RoomSchema } from 'src/room/room.schema';
import { PropertyModule } from 'src/property/property.module';
import { PropertyService } from 'src/property/property.service';
import { PropertyController } from 'src/property/property.controller';
import { BookingModule } from 'src/booking/booking.module';
import { Booking, BookingSchema } from 'src/booking/booking.schema';
import { BookingService } from 'src/booking/booking.service';
import { RoomService } from 'src/room/room.service';
import { SessionModule } from 'src/session/session.module';
import { Session, SessionSchema } from 'src/session/session.schema';
import { SessionService } from 'src/session/session.service';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/user/user.schema';
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
  controllers: [ReviewController, PropertyController],
  providers: [
    ReviewService,
    PropertyService,
    BookingService,
    RoomService,
    SessionService,
    NotificationGateway,
    NotificationService,
    GmailService,
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: Review.name,
        schema: ReviewSchema,
      },
      { name: Property.name, schema: PropertySchema },
      { name: Room.name, schema: RoomSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Session.name, schema: SessionSchema },
      { name: User.name, schema: UserSchema },
      {
        name: Promotion.name,
        schema: PromotionSchema,
      },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    JwtModule.register({
      secret: jwtConstant.secret,

      signOptions: { expiresIn: '60m' },
    }),
    PassportModule,
    forwardRef(() => PropertyModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => GmailModule),

    forwardRef(() => BookingModule),
    forwardRef(() => SessionModule),
    forwardRef(() => UserModule),
    forwardRef(() => PromotionModule),

    forwardRef(() => RoomModule),
  ],
})
export class ReviewModule {}
