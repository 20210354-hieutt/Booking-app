import { NotificationService } from './notification.service';
import { ObjectId } from 'mongoose';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    createNotification(data: any): Promise<import("mongoose").Document<unknown, {}, import("./notification.schema").Notification> & import("./notification.schema").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getUnseenNoti(userId: ObjectId): Promise<(import("mongoose").Document<unknown, {}, import("./notification.schema").Notification> & import("./notification.schema").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getSeenNoti(userId: ObjectId): Promise<(import("mongoose").Document<unknown, {}, import("./notification.schema").Notification> & import("./notification.schema").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getAllNotification(userId: string): Promise<{
        noti: (import("mongoose").Document<unknown, {}, import("./notification.schema").Notification> & import("./notification.schema").Notification & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        })[];
        seen: number;
        unseen: number;
    }>;
    markAsRead(notiId: string): Promise<import("mongoose").Document<unknown, {}, import("./notification.schema").Notification> & import("./notification.schema").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    markAllAsRead(user_id: string): Promise<import("mongoose").UpdateWriteOpResult>;
}
