"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./user.schema");
const Authentication_middleware_1 = require("../common/middleware/Authentication.middleware");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("../common/strategy/jwt.strategy");
const CreateUser_middleware_1 = require("../common/middleware/CreateUser.middleware");
const passport_1 = require("@nestjs/passport");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const session_schema_1 = require("../session/session.schema");
const session_service_1 = require("../session/session.service");
const ResetPassword_middleware_1 = require("../common/middleware/ResetPassword.middleware");
const CheckPassword_middleware_1 = require("../common/middleware/CheckPassword.middleware");
const notification_gateway_1 = require("../notification/notification/notification.gateway");
const notification_module_1 = require("../notification/notification.module");
const notification_service_1 = require("../notification/notification.service");
const notification_schema_1 = require("../notification/notification.schema");
const jwtConstant = {
    secret: 'jwtsecret',
};
let UserModule = class UserModule {
    configure(consumer) {
        consumer
            .apply(Authentication_middleware_1.ValidationMiddleware)
            .forRoutes({ path: '/user/sign-up', method: common_1.RequestMethod.POST }, { path: '/user/sign-in', method: common_1.RequestMethod.POST })
            .apply(CreateUser_middleware_1.CreateUserMiddleware)
            .forRoutes({ path: '/user/create-user', method: common_1.RequestMethod.POST }, { path: '/user/sign-up', method: common_1.RequestMethod.POST }, { path: '/user/update-user', method: common_1.RequestMethod.POST })
            .apply(ResetPassword_middleware_1.ResetPasswordMiddleware)
            .forRoutes({ path: '/user/reset-password', method: common_1.RequestMethod.POST }, { path: '/user/checkResetPasswordToken', method: common_1.RequestMethod.POST })
            .apply(CheckPassword_middleware_1.CheckPasswordMiddleware)
            .forRoutes({
            path: 'user/sign-up-with-email',
            method: common_1.RequestMethod.POST,
        });
    }
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        controllers: [user_controller_1.UserController],
        providers: [
            user_service_1.UserService,
            jwt_strategy_1.JwtStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            session_service_1.SessionService,
            notification_gateway_1.NotificationGateway,
            notification_service_1.NotificationService,
        ],
        exports: [user_service_1.UserService, jwt_1.JwtModule, jwt_auth_guard_1.JwtAuthGuard, session_service_1.SessionService],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: user_schema_1.User.name,
                    schema: user_schema_1.UserSchema,
                },
                { name: session_schema_1.Session.name, schema: session_schema_1.SessionSchema },
                { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
            ]),
            jwt_1.JwtModule.register({
                secret: jwtConstant.secret,
                signOptions: { expiresIn: '60m' },
            }),
            passport_1.PassportModule,
            (0, common_1.forwardRef)(() => notification_module_1.NotificationModule),
        ],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map