import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ObjectId } from 'mongoose';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Post()
  createNotification(@Body() data: any) {
    return this.notificationService.createNotification(data);
  }

  @Get('/unseen/:userId')
  getUnseenNoti(@Param('userId') userId: ObjectId) {
    return this.notificationService.getUnseenNoti(userId);
  }
  @Get('/unread/:userId')
  getSeenNoti(@Param('userId') userId: ObjectId) {
    return this.notificationService.getSeenNoti(userId);
  }
  @Get('/getAllNotification/:userId')
  getAllNotification(@Param('userId') userId: string) {
    return this.notificationService.getAllNotificationWithUser(userId);
  }
  @Get(`markAsRead/:notiId`)
  markAsRead(@Param('notiId') notiId: string) {
    return this.notificationService.markAsRead(notiId);
  }
  @Get(`markAllAsRead/:user_id`)
  markAllAsRead(@Param('user_id') user_id: string) {
    return this.notificationService.markAllAsRead(user_id);
  }
}
