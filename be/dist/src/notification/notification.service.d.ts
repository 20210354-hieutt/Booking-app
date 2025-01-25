import { Model, ObjectId, Types } from 'mongoose';
import { Notification } from './notification.schema';
export declare class NotificationService {
    private readonly notificationSchema;
    constructor(notificationSchema: Model<Notification>);
    getUnseenNoti(user_id: ObjectId): Promise<(import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getAllNotificationWithUser(user_id: string): Promise<{
        noti: (import("mongoose").Document<unknown, {}, Notification> & Notification & {
            _id: Types.ObjectId;
        } & {
            __v?: number;
        })[];
        seen: number;
        unseen: number;
    }>;
    getSeenNoti(user_id: ObjectId): Promise<(import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    markAllAsRead(user_id: string): Promise<import("mongoose").UpdateWriteOpResult>;
    markAsRead(notificationId: string): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }>;
    deleteOldNotifications(): Promise<import("mongodb").DeleteResult>;
    createNotification(notification: any): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
