import { forwardRef, Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './session.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User, UserSchema } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { BookingModule } from 'src/booking/booking.module';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationGateway } from 'src/notification/notification/notification.gateway';
import { NotificationService } from 'src/notification/notification.service';
import {
  Notification,
  NotificationSchema,
} from 'src/notification/notification.schema';
const jwtConstant = {
  secret: 'jwtsecret',
};
@Module({
  providers: [
    SessionService,
    JwtService,
    UserService,
    JwtStrategy,
    JwtAuthGuard,
    NotificationGateway,
    NotificationService,
  ],
  controllers: [SessionController],
  exports: [JwtModule, JwtAuthGuard, SessionService, UserService],
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: User.name, schema: UserSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    JwtModule.register({
      secret: jwtConstant.secret,
      signOptions: { expiresIn: '60m' },
    }),
    UserModule,
    forwardRef(() => BookingModule),
    PassportModule,
    NotificationModule,
  ],
})
export class SessionModule {}
