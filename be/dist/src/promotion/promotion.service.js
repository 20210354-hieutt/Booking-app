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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const promotion_schema_1 = require("./promotion.schema");
const mongoose_2 = require("mongoose");
let PromotionService = class PromotionService {
    constructor(promotionSchema) {
        this.promotionSchema = promotionSchema;
    }
    async getAllPromotion() {
        return await this.promotionSchema.find();
    }
    async createPromotion(createPromotionDto) {
        const newPromotion = new this.promotionSchema(createPromotionDto);
        return await newPromotion.save();
    }
    async getPromotionById(id) {
        return await this.promotionSchema.findById(id);
    }
    async deletePromotionById(id) {
        return await this.promotionSchema.findByIdAndDelete(id);
    }
    async findRoomPromotionForBooking(roomId) {
        const findPromotion = await this.promotionSchema.findOne({
            roomId: {
                $in: [roomId],
            },
        });
        return findPromotion;
    }
    async findPropertyPromotionForBooking(propertyId) {
        const findPromotion = await this.promotionSchema.findOne({
            propertyId: {
                $in: [propertyId],
            },
        });
        return findPromotion;
    }
};
exports.PromotionService = PromotionService;
exports.PromotionService = PromotionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(promotion_schema_1.Promotion.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PromotionService);
//# sourceMappingURL=promotion.service.js.map