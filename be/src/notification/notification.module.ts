import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification/notification.gateway';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';

@Module({
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationGateway],
  controllers: [NotificationController],
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
})
export class NotificationModule {}
