"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionModule = void 0;
const common_1 = require("@nestjs/common");
const session_service_1 = require("./session.service");
const session_controller_1 = require("./session.controller");
const mongoose_1 = require("@nestjs/mongoose");
const session_schema_1 = require("./session.schema");
const jwt_1 = require("@nestjs/jwt");
const user_schema_1 = require("../user/user.schema");
const user_service_1 = require("../user/user.service");
const user_module_1 = require("../user/user.module");
const booking_module_1 = require("../booking/booking.module");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const jwt_strategy_1 = require("../common/strategy/jwt.strategy");
const passport_1 = require("@nestjs/passport");
const notification_module_1 = require("../notification/notification.module");
const notification_gateway_1 = require("../notification/notification/notification.gateway");
const notification_service_1 = require("../notification/notification.service");
const notification_schema_1 = require("../notification/notification.schema");
const jwtConstant = {
    secret: 'jwtsecret',
};
let SessionModule = class SessionModule {
};
exports.SessionModule = SessionModule;
exports.SessionModule = SessionModule = __decorate([
    (0, common_1.Module)({
        providers: [
            session_service_1.SessionService,
            jwt_1.JwtService,
            user_service_1.UserService,
            jwt_strategy_1.JwtStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            notification_gateway_1.NotificationGateway,
            notification_service_1.NotificationService,
        ],
        controllers: [session_controller_1.SessionController],
        exports: [jwt_1.JwtModule, jwt_auth_guard_1.JwtAuthGuard, session_service_1.SessionService, user_service_1.UserService],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: session_schema_1.Session.name, schema: session_schema_1.SessionSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
            ]),
            jwt_1.JwtModule.register({
                secret: jwtConstant.secret,
                signOptions: { expiresIn: '60m' },
            }),
            user_module_1.UserModule,
            (0, common_1.forwardRef)(() => booking_module_1.BookingModule),
            passport_1.PassportModule,
            notification_module_1.NotificationModule,
        ],
    })
], SessionModule);
//# sourceMappingURL=session.module.js.map