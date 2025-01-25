"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionModule = void 0;
const common_1 = require("@nestjs/common");
const promotion_controller_1 = require("./promotion.controller");
const promotion_service_1 = require("./promotion.service");
const mongoose_1 = require("@nestjs/mongoose");
const promotion_schema_1 = require("./promotion.schema");
const booking_schema_1 = require("../booking/booking.schema");
const booking_module_1 = require("../booking/booking.module");
let PromotionModule = class PromotionModule {
};
exports.PromotionModule = PromotionModule;
exports.PromotionModule = PromotionModule = __decorate([
    (0, common_1.Module)({
        controllers: [promotion_controller_1.PromotionController],
        providers: [promotion_service_1.PromotionService],
        exports: [promotion_service_1.PromotionService],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: promotion_schema_1.Promotion.name,
                    schema: promotion_schema_1.PromotionSchema,
                },
                {
                    name: booking_schema_1.Booking.name,
                    schema: booking_schema_1.BookingSchema,
                },
            ]),
            (0, common_1.forwardRef)(() => booking_module_1.BookingModule),
        ],
    })
], PromotionModule);
//# sourceMappingURL=promotion.module.js.map