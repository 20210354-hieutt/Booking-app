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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const roles_guard_1 = require("../common/guards/roles.guard");
const role_enum_1 = require("../user/enum/role.enum");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const validateToken_guard_1 = require("../common/guards/validateToken.guard");
let BookingController = class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    async createBooking(createBookingDto) {
        console.log(createBookingDto);
        return this.bookingService.createBooking(createBookingDto);
    }
    async getMonthlyRevenue(id) {
        return this.bookingService.getMonthlyRevenueByOwner(id);
    }
    async getMonthlyRevenueByProperty(id) {
        return this.bookingService.getMonthlyRevenueByProperty(id);
    }
    async getBookingByOwner(id) {
        return this.bookingService.getBookingByOwner(id);
    }
    async cancelBooking(id) {
        return this.bookingService.cancelBooking(id);
    }
    async confirmCancellation(booking_id, redirect, res) {
        try {
            const success = await this.bookingService.finalizeCancellation(booking_id);
            if (success) {
                return res.redirect(`${redirect}?status=success`);
            }
            else {
                return res.redirect(`${redirect}?status=failure`);
            }
        }
        catch (error) {
            console.log(error);
            return res.redirect(`${redirect}?status=error`);
        }
    }
    async findUnfinishedBooking(userId) {
        return this.bookingService.findUnfinishedBooking(userId);
    }
    async calculateTotalNightPriceForReservation(data) {
        return this.bookingService.calculateTotalNightPriceForReservation(data);
    }
    async updateBookingStatus(bookingId, data) {
        return this.bookingService.updateBookingStatus(bookingId, data);
    }
    async getAllBooking() {
        return this.bookingService.getAllBooking();
    }
    async createBookingWithAdmin(data) {
        return this.bookingService.createBookingWithAdmin(data);
    }
    async deleteBookingById(id) {
        return this.bookingService.deleteBookingById(id);
    }
    async updateBookingById(id, data) {
        return this.bookingService.updateBookingById(id, data.data);
    }
    async getCompletedAndCancelledBookingByUser(id) {
        return this.bookingService.getCompletedAndCancelledBookingByUser(id);
    }
    async getRoomById(bookingId) {
        return this.bookingService.getById(bookingId);
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.Post)('createBooking'),
    (0, roles_decorator_1.Roles)(role_enum_1.ROLE.MEMBER, role_enum_1.ROLE.PARTNER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "createBooking", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.ROLE.PARTNER),
    (0, common_1.Get)(`/getMonthlyRevenue/:id`),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getMonthlyRevenue", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.ROLE.PARTNER),
    (0, common_1.Get)(`/getMonthlyRevenueByProperty/:id`),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getMonthlyRevenueByProperty", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.ROLE.PARTNER, role_enum_1.ROLE.MEMBER),
    (0, common_1.Get)(`/getBookingByOwner/:id/`),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookingByOwner", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.ROLE.PARTNER, role_enum_1.ROLE.MEMBER),
    (0, common_1.Delete)('/cancelBooking/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "cancelBooking", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.ROLE.PARTNER, role_enum_1.ROLE.MEMBER),
    (0, common_1.Get)('confirm-cancellation'),
    __param(0, (0, common_1.Query)('booking_id')),
    __param(1, (0, common_1.Query)('redirect')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "confirmCancellation", null);
__decorate([
    (0, common_1.Get)(`/findUnfinishedBooking/:userId`),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "findUnfinishedBooking", null);
__decorate([
    (0, common_1.Post)('/calculateTotalNightPriceForReservation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "calculateTotalNightPriceForReservation", null);
__decorate([
    (0, common_1.Post)(`/updateBookingStatus/:bookingId`),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "updateBookingStatus", null);
__decorate([
    (0, common_1.UseGuards)(validateToken_guard_1.ValidateTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.ROLE.ADMIN),
    (0, common_1.Get)('/getAllBooking'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getAllBooking", null);
__decorate([
    (0, common_1.Post)('/createBookingWithAdmin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "createBookingWithAdmin", null);
__decorate([
    (0, common_1.Delete)('/deleteBookingById/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "deleteBookingById", null);
__decorate([
    (0, common_1.Put)('updateBookingById/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "updateBookingById", null);
__decorate([
    (0, common_1.Get)('getCompletedAndCancelledBookingByUser/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getCompletedAndCancelledBookingByUser", null);
__decorate([
    (0, common_1.Get)('getBookingById/:bookingId'),
    __param(0, (0, common_1.Param)('bookingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getRoomById", null);
exports.BookingController = BookingController = __decorate([
    (0, common_1.Controller)('booking'),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
//# sourceMappingURL=booking.controller.js.map