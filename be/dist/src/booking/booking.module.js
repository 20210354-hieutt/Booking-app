"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModule = void 0;
const common_1 = require("@nestjs/common");
const booking_controller_1 = require("./booking.controller");
const mongoose_1 = require("@nestjs/mongoose");
const booking_schema_1 = require("./booking.schema");
const booking_service_1 = require("./booking.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const session_service_1 = require("../session/session.service");
const session_schema_1 = require("../session/session.schema");
const user_module_1 = require("../user/user.module");
const user_schema_1 = require("../user/user.schema");
const user_service_1 = require("../user/user.service");
const promotion_schema_1 = require("../promotion/promotion.schema");
const promotion_module_1 = require("../promotion/promotion.module");
const room_schema_1 = require("../room/room.schema");
const room_module_1 = require("../room/room.module");
const session_module_1 = require("../session/session.module");
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
let BookingModule = class BookingModule {
};
exports.BookingModule = BookingModule;
exports.BookingModule = BookingModule = __decorate([
    (0, common_1.Module)({
        controllers: [booking_controller_1.BookingController],
        providers: [
            booking_service_1.BookingService,
            jwt_auth_guard_1.JwtAuthGuard,
            session_service_1.SessionService,
            user_service_1.UserService,
            promotion_service_1.PromotionService,
            notification_gateway_1.NotificationGateway,
            notification_service_1.NotificationService,
            gmail_service_1.GmailService,
        ],
        exports: [booking_service_1.BookingService],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: booking_schema_1.Booking.name,
                    schema: booking_schema_1.BookingSchema,
                },
                {
                    name: session_schema_1.Session.name,
                    schema: session_schema_1.SessionSchema,
                },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: promotion_schema_1.Promotion.name, schema: promotion_schema_1.PromotionSchema },
                { name: room_schema_1.Room.name, schema: room_schema_1.RoomSchema },
                { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
            ]),
            jwt_1.JwtModule.register({
                secret: jwtConstant.secret,
                signOptions: { expiresIn: '60m' },
            }),
            passport_1.PassportModule,
            notification_module_1.NotificationModule,
            user_module_1.UserModule,
            promotion_module_1.PromotionModule,
            (0, common_1.forwardRef)(() => room_module_1.RoomModule),
            (0, common_1.forwardRef)(() => gmail_module_1.GmailModule),
            (0, common_1.forwardRef)(() => session_module_1.SessionModule),
            (0, common_1.forwardRef)(() => notification_module_1.NotificationModule),
        ],
    })
], BookingModule);
//# sourceMappingURL=booking.module.js.map