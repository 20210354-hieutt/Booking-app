"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyModule = void 0;
const common_1 = require("@nestjs/common");
const property_controller_1 = require("./property.controller");
const property_service_1 = require("./property.service");
const mongoose_1 = require("@nestjs/mongoose");
const property_schema_1 = require("./property.schema");
const booking_service_1 = require("../booking/booking.service");
const booking_module_1 = require("../booking/booking.module");
const booking_schema_1 = require("../booking/booking.schema");
const session_module_1 = require("../session/session.module");
const promises_1 = require("inspector/promises");
const session_schema_1 = require("../session/session.schema");
const session_service_1 = require("../session/session.service");
const jwt_1 = require("@nestjs/jwt");
const room_service_1 = require("../room/room.service");
const room_module_1 = require("../room/room.module");
const room_schema_1 = require("../room/room.schema");
const review_module_1 = require("../review/review.module");
const review_schema_1 = require("../review/review.schema");
const user_schema_1 = require("../user/user.schema");
const user_module_1 = require("../user/user.module");
const review_service_1 = require("../review/review.service");
const promotion_schema_1 = require("../promotion/promotion.schema");
const promotion_module_1 = require("../promotion/promotion.module");
const notification_gateway_1 = require("../notification/notification/notification.gateway");
const notification_module_1 = require("../notification/notification.module");
const notification_service_1 = require("../notification/notification.service");
const notification_schema_1 = require("../notification/notification.schema");
const gmail_module_1 = require("../gmail/gmail.module");
const gmail_service_1 = require("../gmail/gmail.service");
const jwtConstant = {
    secret: 'jwtsecret',
};
let PropertyModule = class PropertyModule {
};
exports.PropertyModule = PropertyModule;
exports.PropertyModule = PropertyModule = __decorate([
    (0, common_1.Module)({
        controllers: [property_controller_1.PropertyController],
        providers: [
            property_service_1.PropertyService,
            booking_service_1.BookingService,
            session_service_1.SessionService,
            room_service_1.RoomService,
            review_service_1.ReviewService,
            notification_gateway_1.NotificationGateway,
            notification_service_1.NotificationService,
            gmail_service_1.GmailService,
        ],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: property_schema_1.Property.name,
                    schema: property_schema_1.PropertySchema,
                },
                {
                    name: promotion_schema_1.Promotion.name,
                    schema: promotion_schema_1.PromotionSchema,
                },
                {
                    name: booking_schema_1.Booking.name,
                    schema: booking_schema_1.BookingSchema,
                },
                {
                    name: promises_1.Session.name,
                    schema: session_schema_1.SessionSchema,
                },
                { name: room_schema_1.Room.name, schema: room_schema_1.RoomSchema },
                { name: review_schema_1.Review.name, schema: review_schema_1.ReviewSchema },
                {
                    name: user_schema_1.User.name,
                    schema: user_schema_1.UserSchema,
                },
                { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
            ]),
            (0, common_1.forwardRef)(() => booking_module_1.BookingModule),
            (0, common_1.forwardRef)(() => session_module_1.SessionModule),
            (0, common_1.forwardRef)(() => room_module_1.RoomModule),
            (0, common_1.forwardRef)(() => notification_module_1.NotificationModule),
            (0, common_1.forwardRef)(() => gmail_module_1.GmailModule),
            review_module_1.ReviewModule,
            user_module_1.UserModule,
            promotion_module_1.PromotionModule,
            jwt_1.JwtModule.register({
                secret: jwtConstant.secret,
                signOptions: { expiresIn: '60m' },
            }),
        ],
    })
], PropertyModule);
//# sourceMappingURL=property.module.js.map