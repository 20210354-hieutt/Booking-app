"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomModule = void 0;
const common_1 = require("@nestjs/common");
const room_controller_1 = require("./room.controller");
const room_service_1 = require("./room.service");
const mongoose_1 = require("@nestjs/mongoose");
const room_schema_1 = require("./room.schema");
const review_schema_1 = require("../review/review.schema");
const booking_service_1 = require("../booking/booking.service");
const booking_module_1 = require("../booking/booking.module");
const booking_schema_1 = require("../booking/booking.schema");
const session_module_1 = require("../session/session.module");
const session_service_1 = require("../session/session.service");
const promises_1 = require("inspector/promises");
const session_schema_1 = require("../session/session.schema");
const jwt_1 = require("@nestjs/jwt");
const property_module_1 = require("../property/property.module");
const property_schema_1 = require("../property/property.schema");
const user_module_1 = require("../user/user.module");
const user_schema_1 = require("../user/user.schema");
const user_service_1 = require("../user/user.service");
const promotion_schema_1 = require("../promotion/promotion.schema");
const promotion_module_1 = require("../promotion/promotion.module");
const promotion_service_1 = require("../promotion/promotion.service");
const notification_module_1 = require("../notification/notification.module");
const notification_gateway_1 = require("../notification/notification/notification.gateway");
const notification_service_1 = require("../notification/notification.service");
const notification_schema_1 = require("../notification/notification.schema");
const gmail_service_1 = require("../gmail/gmail.service");
const gmail_module_1 = require("../gmail/gmail.module");
const jwtConstant = {
    secret: 'jwtsecret',
};
let RoomModule = class RoomModule {
};
exports.RoomModule = RoomModule;
exports.RoomModule = RoomModule = __decorate([
    (0, common_1.Module)({
        controllers: [room_controller_1.RoomController],
        providers: [
            room_service_1.RoomService,
            booking_service_1.BookingService,
            session_service_1.SessionService,
            user_service_1.UserService,
            promotion_service_1.PromotionService,
            notification_gateway_1.NotificationGateway,
            notification_service_1.NotificationService,
            gmail_service_1.GmailService,
        ],
        exports: [room_service_1.RoomService],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: room_schema_1.Room.name, schema: room_schema_1.RoomSchema },
                { name: review_schema_1.Review.name, schema: review_schema_1.ReviewSchema },
                { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema },
                { name: promotion_schema_1.Promotion.name, schema: promotion_schema_1.PromotionSchema },
                { name: promises_1.Session.name, schema: session_schema_1.SessionSchema },
                { name: property_schema_1.Property.name, schema: property_schema_1.PropertySchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
            ]),
            jwt_1.JwtModule.register({
                secret: jwtConstant.secret,
                signOptions: { expiresIn: '60m' },
            }),
            (0, common_1.forwardRef)(() => session_module_1.SessionModule),
            (0, common_1.forwardRef)(() => notification_module_1.NotificationModule),
            (0, common_1.forwardRef)(() => gmail_module_1.GmailModule),
            (0, common_1.forwardRef)(() => booking_module_1.BookingModule),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => promotion_module_1.PromotionModule),
            property_module_1.PropertyModule,
        ],
    })
], RoomModule);
//# sourceMappingURL=room.module.js.map