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
exports.RoomController = void 0;
const common_1 = require("@nestjs/common");
const room_service_1 = require("./room.service");
const createRoom_dto_1 = require("./dto/createRoom.dto");
const findRoom_dto_1 = require("./dto/findRoom.dto");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../user/enum/role.enum");
const validateToken_guard_1 = require("../common/guards/validateToken.guard");
let RoomController = class RoomController {
    constructor(roomService) {
        this.roomService = roomService;
    }
    async createRoom(createRoomDto) {
        return this.roomService.createRoom(createRoomDto);
    }
    async getRoomWithProperty(property_id) {
        return this.roomService.getRoomWithProperty(property_id.property_id);
    }
    async findRoom(findRoomDto) {
        return this.roomService.findRoom(findRoomDto);
    }
    async findAvailableRoomWithSearch(data) {
        return this.roomService.findAvailableRoomWithSearch(data.userId, data.place || data.province, data.check_in, data.check_out, data.capacity, data.type);
    }
    async updateImageForRoom(data) {
        return this.roomService.updateImageForRoom(data.roomId, data.image);
    }
    async getMonthlyOccupancyRatesByOwner(id) {
        return this.roomService.getMonthlyOccupancyRatesByOwner(id, 2024);
    }
    async getMonthlyOccupancyRatesByProperty(id) {
        return this.roomService.getMonthlyOccupancyRatesByProperty(id, 2024);
    }
    async deleteRoomById(id) {
        return this.roomService.deleteRoom(id);
    }
    async getAllRoomWithTotalPrice(data) {
        return this.roomService.getAllRoomWithTotalPrice({
            check_in: data.check_in,
            check_out: data.check_out,
            place: data.place,
            userId: data.userId,
            capacity: data.capacity,
        });
    }
    async getAllRoomWithDetails() {
        return this.roomService.getAllRoomWithDetails();
    }
    async getRoomWithPriceByProperty(data) {
        return this.roomService.getRoomWithPriceByProperty(data.property_id, data.check_out, data.check_in);
    }
    async findRoomInReservation(data) {
        return this.roomService.findRoomInReservation(data.property_id, data.capacity, data.check_in_date, data.check_out_date);
    }
    async getRoomById(roomId) {
        return this.roomService.getRoomById(roomId);
    }
};
exports.RoomController = RoomController;
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, validateToken_guard_1.ValidateTokenGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.ROLE.PARTNER, role_enum_1.ROLE.ADMIN),
    (0, common_1.Post)('createRoom'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createRoom_dto_1.CreateRoomDto]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Post)('getRoomWithProperty'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getRoomWithProperty", null);
__decorate([
    (0, common_1.Post)('findRoom'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [findRoom_dto_1.FindRoomDto]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "findRoom", null);
__decorate([
    (0, common_1.Post)('findAvailableRoomWithSearch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "findAvailableRoomWithSearch", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, validateToken_guard_1.ValidateTokenGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.ROLE.PARTNER, role_enum_1.ROLE.ADMIN),
    (0, common_1.Put)('updateImageForRoom'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "updateImageForRoom", null);
__decorate([
    (0, common_1.Get)('getMonthlyOccupancyRatesByOwner/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getMonthlyOccupancyRatesByOwner", null);
__decorate([
    (0, common_1.Get)('getMonthlyOccupancyRatesByProperty/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getMonthlyOccupancyRatesByProperty", null);
__decorate([
    (0, common_1.Delete)(`deleteRoomById/:id`),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "deleteRoomById", null);
__decorate([
    (0, common_1.Post)('getAllRoomWithTotalPrice'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getAllRoomWithTotalPrice", null);
__decorate([
    (0, common_1.Get)('getAllRoomWithDetails'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getAllRoomWithDetails", null);
__decorate([
    (0, common_1.Post)('getRoomWithPriceByProperty'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getRoomWithPriceByProperty", null);
__decorate([
    (0, common_1.Post)('findRoomInReservation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "findRoomInReservation", null);
__decorate([
    (0, common_1.Get)('getRoomById/:roomId'),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getRoomById", null);
exports.RoomController = RoomController = __decorate([
    (0, common_1.Controller)('room'),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], RoomController);
//# sourceMappingURL=room.controller.js.map