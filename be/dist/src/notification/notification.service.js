"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("./notification.schema");
let NotificationService = class NotificationService {
    constructor(notificationSchema) {
        this.notificationSchema = notificationSchema;
    }
    async getUnseenNoti(user_id) {
        return this.notificationSchema
            .find({ receiver_id: user_id, status: false })
            .sort({ created_at: -1 });
    }
    async getAllNotificationWithUser(user_id) {
        const countUnseen = await this.notificationSchema.countDocuments({
            receiver_id: new mongoose_2.Types.ObjectId(user_id),
            status: false,
        });
        const countSeen = await this.notificationSchema.countDocuments({
            receiver_id: new mongoose_2.Types.ObjectId(user_id),
            status: true,
        });
        const findNoti = await this.notificationSchema.find({
            receiver_id: new mongoose_2.Types.ObjectId(user_id),
        }).sort({ createdAt: -1 });
        return {
            noti: findNoti,
            seen: countSeen,
            unseen: countUnseen,
        };
    }
    async getSeenNoti(user_id) {
        return this.notificationSchema
            .find({ receiver_id: user_id, status: true })
            .sort({ created_at: -1 });
    }
    async markAllAsRead(user_id) {
        return this.notificationSchema.updateMany({
            receiver_id: new mongoose_2.Types.ObjectId(user_id),
        }, {
            $set: { status: true },
        });
    }
    async markAsRead(notificationId) {
        return this.notificationSchema.findByIdAndUpdate(new mongoose_2.Types.ObjectId(notificationId), { status: true }, { new: true });
    }
    async deleteOldNotifications() {
        return this.notificationSchema.deleteMany({
            expires_at: { $lte: new Date() },
        });
    }
    async createNotification(notification) {
        const newNoti = new this.notificationSchema(notification);
        const savedNoti = await newNoti.save();
        return savedNoti;
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationService);
//# sourceMappingURL=notification.service.js.map