"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModule = void 0;
const common_1 = require("@nestjs/common");
const review_controller_1 = require("./review.controller");
const review_service_1 = require("./review.service");
const mongoose_1 = require("@nestjs/mongoose");
const review_schema_1 = require("./review.schema");
const property_schema_1 = require("../property/property.schema");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const room_module_1 = require("../room/room.module");
const room_schema_1 = require("../room/room.schema");
const property_module_1 = require("../property/property.module");
const property_service_1 = require("../property/property.service");
const property_controller_1 = require("../property/property.controller");
const booking_module_1 = require("../booking/booking.module");
const booking_schema_1 = require("../booking/booking.schema");
const booking_service_1 = require("../booking/booking.service");
const room_service_1 = require("../room/room.service");
const session_module_1 = require("../session/session.module");
const session_schema_1 = require("../session/session.schema");
const session_service_1 = require("../session/session.service");
const user_module_1 = require("../user/user.module");
const user_schema_1 = require("../user/user.schema");
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
let ReviewModule = class ReviewModule {
};
exports.ReviewModule = ReviewModule;
exports.ReviewModule = ReviewModule = __decorate([
    (0, common_1.Module)({
        controllers: [review_controller_1.ReviewController, property_controller_1.PropertyController],
        providers: [
            review_service_1.ReviewService,
            property_service_1.PropertyService,
            booking_service_1.BookingService,
            room_service_1.RoomService,
            session_service_1.SessionService,
            notification_gateway_1.NotificationGateway,
            notification_service_1.NotificationService,
            gmail_service_1.GmailService,
        ],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: review_schema_1.Review.name,
                    schema: review_schema_1.ReviewSchema,
                },
                { name: property_schema_1.Property.name, schema: property_schema_1.PropertySchema },
                { name: room_schema_1.Room.name, schema: room_schema_1.RoomSchema },
                { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema },
                { name: session_schema_1.Session.name, schema: session_schema_1.SessionSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                {
                    name: promotion_schema_1.Promotion.name,
                    schema: promotion_schema_1.PromotionSchema,
                },
                { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
            ]),
            jwt_1.JwtModule.register({
                secret: jwtConstant.secret,
                signOptions: { expiresIn: '60m' },
            }),
            passport_1.PassportModule,
            (0, common_1.forwardRef)(() => property_module_1.PropertyModule),
            (0, common_1.forwardRef)(() => notification_module_1.NotificationModule),
            (0, common_1.forwardRef)(() => gmail_module_1.GmailModule),
            (0, common_1.forwardRef)(() => booking_module_1.BookingModule),
            (0, common_1.forwardRef)(() => session_module_1.SessionModule),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => promotion_module_1.PromotionModule),
            (0, common_1.forwardRef)(() => room_module_1.RoomModule),
        ],
    })
], ReviewModule);
//# sourceMappingURL=review.module.js.map