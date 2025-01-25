import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Notification } from './notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationSchema: Model<Notification>,
  ) {}
  async getUnseenNoti(user_id: ObjectId) {
    return this.notificationSchema
      .find({ receiver_id: user_id, status: false })
      .sort({ created_at: -1 });
  }
  async getAllNotificationWithUser(user_id: string) {
    const countUnseen = await this.notificationSchema.countDocuments({
      receiver_id: new Types.ObjectId(user_id),
      status: false,
    });
    const countSeen = await this.notificationSchema.countDocuments({
      receiver_id: new Types.ObjectId(user_id),
      status: true,
    });
    const findNoti = await this.notificationSchema.find({
      receiver_id: new Types.ObjectId(user_id),
    }).sort({ createdAt: -1 });
    return {
      noti: findNoti,
      seen: countSeen,
      unseen: countUnseen,
    };
  }
  async getSeenNoti(user_id: ObjectId) {
    return this.notificationSchema
      .find({ receiver_id: user_id, status: true })
      .sort({ created_at: -1 });
  }
  async markAllAsRead(user_id: string) {
    return this.notificationSchema.updateMany(
      {
        receiver_id: new Types.ObjectId(user_id),
      },
      {
        $set: { status: true },
      },
    );
  }
  async markAsRead(notificationId: string) {
    return this.notificationSchema.findByIdAndUpdate(
      new Types.ObjectId(notificationId),
      { status: true },
      { new: true },
    );
  }
  async deleteOldNotifications() {
    return this.notificationSchema.deleteMany({
      expires_at: { $lte: new Date() },
    });
  }
  async createNotification(notification: any) {
    const newNoti = new this.notificationSchema(notification);
    const savedNoti = await newNoti.save();
    return savedNoti;
  }
}
