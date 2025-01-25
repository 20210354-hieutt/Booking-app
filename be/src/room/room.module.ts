import { forwardRef, Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './room.schema';
import { Review, ReviewSchema } from 'src/review/review.schema';
import { BookingService } from 'src/booking/booking.service';
import { BookingModule } from 'src/booking/booking.module';
import { Booking, BookingSchema } from 'src/booking/booking.schema';
import { SessionModule } from 'src/session/session.module';
import { SessionService } from 'src/session/session.service';
import { Session } from 'inspector/promises';
import { SessionSchema } from 'src/session/session.schema';
import { JwtModule } from '@nestjs/jwt';
import { PropertyModule } from 'src/property/property.module';
import { Property, PropertySchema } from 'src/property/property.schema';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { Promotion, PromotionSchema } from 'src/promotion/promotion.schema';
import { PromotionModule } from 'src/promotion/promotion.module';
import { PromotionService } from 'src/promotion/promotion.service';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationGateway } from 'src/notification/notification/notification.gateway';
import { NotificationService } from 'src/notification/notification.service';
import {
  Notification,
  NotificationSchema,
} from 'src/notification/notification.schema';
import { GmailService } from 'src/gmail/gmail.service';
import { GmailModule } from 'src/gmail/gmail.module';
const jwtConstant = {
  secret: 'jwtsecret',
};
@Module({
  controllers: [RoomController],
  providers: [
    RoomService,
    BookingService,
    SessionService,
    UserService,
    PromotionService,
    NotificationGateway,
    NotificationService,
    GmailService,
  ],
  exports: [RoomService], // Ensure to export services needed by other modules
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Promotion.name, schema: PromotionSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Property.name, schema: PropertySchema },
      { name: User.name, schema: UserSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    JwtModule.register({
      secret: jwtConstant.secret,
      signOptions: { expiresIn: '60m' },
    }),
    forwardRef(() => SessionModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => GmailModule),

    forwardRef(() => BookingModule),
    forwardRef(() => UserModule),
    forwardRef(() => PromotionModule),

    PropertyModule,
  ],
})
export class RoomModule {}
