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
exports.BookingSchema = exports.Booking = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const user_schema_1 = require("../user/user.schema");
const bookingStatus_enum_1 = require("./enum/bookingStatus.enum");
const paymentStatus_enum_1 = require("./enum/paymentStatus.enum");
const property_schema_1 = require("../property/property.schema");
let Booking = class Booking {
};
exports.Booking = Booking;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.default.Schema.ObjectId, ref: 'User' }),
    __metadata("design:type", user_schema_1.User)
], Booking.prototype, "user_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: [{ type: mongoose_2.default.Schema.ObjectId, ref: 'Room' }],
    }),
    __metadata("design:type", Array)
], Booking.prototype, "room_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.default.Schema.ObjectId, ref: 'Property' }),
    __metadata("design:type", property_schema_1.Property)
], Booking.prototype, "property", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date }),
    __metadata("design:type", Date)
], Booking.prototype, "check_in_date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date }),
    __metadata("design:type", Date)
], Booking.prototype, "check_out_date", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: {
            adults: {
                type: Number,
            },
            childs: {
                count: Number,
                age: Number,
            },
            room: {
                type: Number,
            },
        },
    }),
    __metadata("design:type", Object)
], Booking.prototype, "capacity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], Booking.prototype, "total_price", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: bookingStatus_enum_1.BookingStatus,
        default: bookingStatus_enum_1.BookingStatus.PENDING,
    }),
    __metadata("design:type", String)
], Booking.prototype, "booking_status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: paymentStatus_enum_1.PaymentStatus,
        default: paymentStatus_enum_1.PaymentStatus.UNPAID,
    }),
    __metadata("design:type", String)
], Booking.prototype, "payment_status", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], Booking.prototype, "request", void 0);
exports.Booking = Booking = __decorate([
    (0, mongoose_1.Schema)()
], Booking);
exports.BookingSchema = mongoose_1.SchemaFactory.createForClass(Booking);
//# sourceMappingURL=booking.schema.js.map