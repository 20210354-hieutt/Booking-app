"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const payment_controller_1 = require("./payment.controller");
const payment_service_1 = require("./payment.service");
const mongoose_1 = require("@nestjs/mongoose");
const payment_schema_1 = require("./payment.schema");
const gmail_service_1 = require("../gmail/gmail.service");
const gmail_module_1 = require("../gmail/gmail.module");
const booking_schema_1 = require("../booking/booking.schema");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        controllers: [payment_controller_1.PaymentController],
        providers: [payment_service_1.PaymentService, gmail_service_1.GmailService],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: payment_schema_1.Payment.name,
                    schema: payment_schema_1.PaymentSchema,
                },
                {
                    name: booking_schema_1.Booking.name,
                    schema: booking_schema_1.BookingSchema,
                },
            ]),
            gmail_module_1.GmailModule,
        ],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map