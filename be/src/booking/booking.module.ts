import { forwardRef, Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './booking.schema';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SessionService } from 'src/session/session.service';
import { Session, SessionSchema } from 'src/session/session.schema';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { Promotion, PromotionSchema } from 'src/promotion/promotion.schema';
import { PromotionModule } from 'src/promotion/promotion.module';
import { Room, RoomSchema } from 'src/room/room.schema';
import { RoomModule } from 'src/room/room.module';
import { SessionModule } from 'src/session/session.module';
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
  controllers: [BookingController],
  providers: [
    BookingService,
    JwtAuthGuard,
    SessionService,
    UserService,
    PromotionService,
    NotificationGateway,
    NotificationService,
    GmailService,
  ],
  exports: [BookingService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Booking.name,
        schema: BookingSchema,
      },
      {
        name: Session.name,
        schema: SessionSchema,
      },
      { name: User.name, schema: UserSchema },
      { name: Promotion.name, schema: PromotionSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    JwtModule.register({
      secret: jwtConstant.secret,

      signOptions: { expiresIn: '60m' },
    }),
    PassportModule,
    NotificationModule,
    UserModule,
    PromotionModule,
    forwardRef(() => RoomModule),
    forwardRef(() => GmailModule),

    forwardRef(() => SessionModule),
    forwardRef(() => NotificationModule),
  ],
})
export class BookingModule {}
