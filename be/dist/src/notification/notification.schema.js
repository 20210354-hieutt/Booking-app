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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchema = exports.Notification = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const booking_schema_1 = require("../booking/booking.schema");
const user_schema_1 = require("../user/user.schema");
let Notification = class Notification {
};
exports.Notification = Notification;
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", user_schema_1.User)
], Notification.prototype, "sender_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", user_schema_1.User)
], Notification.prototype, "receiver_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: false,
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'Booking',
    }),
    __metadata("design:type", booking_schema_1.Booking)
], Notification.prototype, "booking_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['Booking', 'Payment', 'Partner'],
        default: 'Booking',
    }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Notification.prototype, "created_at", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }),
    __metadata("design:type", Date)
], Notification.prototype, "expires_at", void 0);
exports.Notification = Notification = __decorate([
    (0, mongoose_1.Schema)()
], Notification);
exports.NotificationSchema = mongoose_1.SchemaFactory.createForClass(Notification);
exports.NotificationSchema.index({ receiver_id: 1 });
exports.NotificationSchema.index({ partner_id: 1 });
exports.NotificationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
//# sourceMappingURL=notification.schema.js.map