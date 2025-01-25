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
exports.PaymentSchema = exports.Payment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const booking_schema_1 = require("../booking/booking.schema");
let Payment = class Payment {
};
exports.Payment = Payment;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.default.Schema.ObjectId, ref: 'Booking' }),
    __metadata("design:type", booking_schema_1.Booking)
], Payment.prototype, "booking_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Payment.prototype, "payment_method", void 0);
__decorate([
    (0, mongoose_1.Prop)({ require: true }),
    __metadata("design:type", String)
], Payment.prototype, "paymentCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ require: true, type: Date }),
    __metadata("design:type", Date)
], Payment.prototype, "paymentDate", void 0);
exports.Payment = Payment = __decorate([
    (0, mongoose_1.Schema)()
], Payment);
exports.PaymentSchema = mongoose_1.SchemaFactory.createForClass(Payment);
//# sourceMappingURL=payment.schema.js.map