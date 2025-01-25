import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { ValidationMiddleware } from 'src/common/middleware/Authentication.middleware';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateUserMiddleware } from 'src/common/middleware/CreateUser.middleware';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Session, SessionSchema } from 'src/session/session.schema';
import { SessionService } from 'src/session/session.service';
import { ResetPasswordMiddleware } from 'src/common/middleware/ResetPassword.middleware';
import { CheckPasswordMiddleware } from 'src/common/middleware/CheckPassword.middleware';
import { NotificationGateway } from 'src/notification/notification/notification.gateway';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationService } from 'src/notification/notification.service';
import { Notification, NotificationSchema } from 'src/notification/notification.schema';
const jwtConstant = {
  secret: 'jwtsecret',
};
@Module({
  controllers: [UserController],
  providers: [
    UserService,
    JwtStrategy,
    JwtAuthGuard,
    SessionService,
    NotificationGateway,
    NotificationService,
  ],
  exports: [UserService, JwtModule, JwtAuthGuard, SessionService],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Session.name, schema: SessionSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    JwtModule.register({
      secret: jwtConstant.secret,

      signOptions: { expiresIn: '60m' },
    }),
    PassportModule,
    forwardRef(() => NotificationModule),
  ],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidationMiddleware)
      .forRoutes(
        { path: '/user/sign-up', method: RequestMethod.POST },
        { path: '/user/sign-in', method: RequestMethod.POST },
      )
      .apply(CreateUserMiddleware)
      .forRoutes(
        { path: '/user/create-user', method: RequestMethod.POST },
        { path: '/user/sign-up', method: RequestMethod.POST },
        { path: '/user/update-user', method: RequestMethod.POST },
      )
      .apply(ResetPasswordMiddleware)
      .forRoutes(
        { path: '/user/reset-password', method: RequestMethod.POST },
        { path: '/user/checkResetPasswordToken', method: RequestMethod.POST },
      )
      .apply(CheckPasswordMiddleware)
      .forRoutes({
        path: 'user/sign-up-with-email',
        method: RequestMethod.POST,
      });
  }
}
