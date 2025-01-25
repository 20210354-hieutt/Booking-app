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
exports.ReviewController = void 0;
const common_1 = require("@nestjs/common");
const review_service_1 = require("./review.service");
const createReview_dto_1 = require("./dto/createReview.dto");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../user/enum/role.enum");
const validateToken_guard_1 = require("../common/guards/validateToken.guard");
let ReviewController = class ReviewController {
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    async createReview(createReviewDto) {
        return this.reviewService.createReview(createReviewDto);
    }
    async findReviewWithProperty(property_id, page) {
        return this.reviewService.findReviewWithProperty(property_id, page);
    }
    async getMonthlyRating(id) {
        return this.reviewService.getMonthlyRating(id);
    }
    async getMonthlyRatingByProperty(id) {
        return this.reviewService.getMonthlyRatingByProperty(id);
    }
    async getReviewByRate(property_id, data, page) {
        return this.reviewService.getReviewByRate(property_id, data.min, data.max, page);
    }
    async getReviewByType(property_id, data, page) {
        return this.reviewService.getReviewByRateAndType(property_id, data.review_type, data.min, data.max, page);
    }
};
exports.ReviewController = ReviewController;
__decorate([
    (0, common_1.UseGuards)(validateToken_guard_1.ValidateTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.ROLE.MEMBER, role_enum_1.ROLE.PARTNER),
    (0, common_1.Post)('/createReview'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createReview_dto_1.CreateReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "createReview", null);
__decorate([
    (0, common_1.Get)('/findReviewWithProperty/:property_id'),
    __param(0, (0, common_1.Param)('property_id')),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "findReviewWithProperty", null);
__decorate([
    (0, common_1.Get)('getMonthlyRating/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getMonthlyRating", null);
__decorate([
    (0, common_1.Get)('getMonthlyRatingByProperty/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getMonthlyRatingByProperty", null);
__decorate([
    (0, common_1.Post)('getReviewByRate/:property_id'),
    __param(0, (0, common_1.Param)('property_id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Number]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getReviewByRate", null);
__decorate([
    (0, common_1.Post)('getReviewByRateAndType/:property_id'),
    __param(0, (0, common_1.Param)('property_id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Number]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getReviewByType", null);
exports.ReviewController = ReviewController = __decorate([
    (0, common_1.Controller)('review'),
    __metadata("design:paramtypes", [review_service_1.ReviewService])
], ReviewController);
//# sourceMappingURL=review.controller.js.map