"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const destination_module_1 = require("./destination/destination.module");
const user_module_1 = require("./user/user.module");
const DefaultRole_Middleware_1 = require("./common/middleware/DefaultRole.Middleware");
const session_module_1 = require("./session/session.module");
const property_module_1 = require("./property/property.module");
const room_module_1 = require("./room/room.module");
const booking_module_1 = require("./booking/booking.module");
const review_module_1 = require("./review/review.module");
const payment_module_1 = require("./payment/payment.module");
const admin = __importStar(require("firebase-admin"));
const serviceAccount = __importStar(require("./config/maithetuan-20211010-firebase-adminsdk-2w4j6-0863a250a1.json"));
const promotion_module_1 = require("./promotion/promotion.module");
const notification_module_1 = require("./notification/notification.module");
const notification_gateway_1 = require("./notification/notification/notification.gateway");
const gmail_service_1 = require("./gmail/gmail.service");
const gmail_module_1 = require("./gmail/gmail.module");
const jwtConstant = {
    secret: 'jwtsecret',
};
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(DefaultRole_Middleware_1.DefaultRoleMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRoot(process.env.DB_URI),
            destination_module_1.DestinationModule,
            user_module_1.UserModule,
            session_module_1.SessionModule,
            property_module_1.PropertyModule,
            room_module_1.RoomModule,
            booking_module_1.BookingModule,
            review_module_1.ReviewModule,
            payment_module_1.PaymentModule,
            promotion_module_1.PromotionModule,
            notification_module_1.NotificationModule,
            gmail_module_1.GmailModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: 'FIREBASE_ADMIN',
                useFactory: () => {
                    return admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                        databaseURL: 'https://booking-app-1edf4.firebaseio.com',
                    });
                },
            },
            notification_gateway_1.NotificationGateway,
            gmail_service_1.GmailService,
        ],
        exports: ['FIREBASE_ADMIN'],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map