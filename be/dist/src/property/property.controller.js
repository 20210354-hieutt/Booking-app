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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyController = void 0;
const common_1 = require("@nestjs/common");
const property_service_1 = require("./property.service");
const validateToken_guard_1 = require("../common/guards/validateToken.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../user/enum/role.enum");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path = __importStar(require("path"));
let PropertyController = class PropertyController {
    constructor(propertyService) {
        this.propertyService = propertyService;
    }
    async createPropertyWithPartner(data, files) {
        console.log(files);
        const propertyImage = files.filter((file, idx) => file.fieldname === `image[${idx}]`);
        const roomImages = files.filter((file) => file.fieldname.startsWith('rooms'));
        if (propertyImage.length !== 0) {
            const propertyData = {
                ...data,
                image: propertyImage.map((image) => image.path),
                address: JSON.parse(data.address),
                location: JSON.parse(data.location),
                rooms: typeof data.rooms === 'string' ? JSON.parse(data.rooms) : data.rooms,
            };
            if (propertyData.rooms) {
                propertyData.rooms = propertyData.rooms.map((room, index) => {
                    const imagesForRoom = roomImages
                        .filter((file, idx) => file.fieldname === `rooms[${index}]image[${idx}]`)
                        .map((file) => ({
                        path: file.path,
                        fieldname: file.fieldname,
                    }));
                    return {
                        ...room,
                        image: imagesForRoom,
                    };
                });
                return this.propertyService.createNewProperty(propertyData);
            }
            else {
                propertyData.rooms = [];
                return this.propertyService.createNewProperty(propertyData);
            }
        }
        else {
            const propertyData = {
                ...data,
                address: JSON.parse(data.address),
                location: JSON.parse(data.location),
                rooms: typeof data.rooms === 'string' ? JSON.parse(data.rooms) : data.rooms,
            };
            return this.propertyService.createNewProperty(propertyData);
        }
    }
    async updatePropertyWithPartner(data, files) {
        console.log(files);
        const propertyImage = files.filter((file, idx) => file.fieldname === `image[${idx}]`);
        const roomImages = files.filter((file) => file.fieldname.startsWith('rooms'));
        if (propertyImage.length !== 0) {
            const propertyData = {
                ...data,
                image: propertyImage.map((image) => image.path),
                address: JSON.parse(data.address),
                location: JSON.parse(data.location),
                rooms: typeof data.rooms === 'string' ? JSON.parse(data.rooms) : data.rooms,
            };
            propertyData.rooms = propertyData.rooms.map((room, index) => {
                const imagesForRoom = roomImages
                    .filter((file, idx) => file.fieldname === `rooms[${index}]image[${idx}]`)
                    .map((file) => ({
                    path: file.path,
                    fieldname: file.fieldname,
                }));
                return {
                    ...room,
                    image: imagesForRoom,
                };
            });
            return this.propertyService.updateProperty(propertyData);
        }
        else {
            const propertyData = {
                ...data,
                address: JSON.parse(data.address),
                location: JSON.parse(data.location),
                rooms: typeof data.rooms === 'string' ? JSON.parse(data.rooms) : data.rooms,
            };
            return this.propertyService.updateProperty(propertyData);
        }
    }
    async getAllProperty() {
        return this.propertyService.getAllProperty();
    }
    async getPropetyWithOwner(id, page = 1, limit = 5) {
        return this.propertyService.getPropertyWithOwner(id, page, limit);
    }
    async getPropertyById(id) {
        return this.propertyService.getPropertyById(id);
    }
    async getPropertiesSortedByRate() {
        return this.propertyService.getPropertiesSortedByRate();
    }
    async getPropertyTypesByPlace(place) {
        return this.propertyService.getPropertyTypesByPlace(place.place);
    }
    async getPropertyByTypeAndPlace(data) {
        return this.propertyService.getPropertyByTypeAndPlace(data.place, data.type);
    }
    async getAllTypeOfProperties() {
        return this.propertyService.getAllTypeOfProperties();
    }
    async getPropertyNear(data) {
        return this.propertyService.getPropertyNear(data.longitude, data.latitude);
    }
    async updateImageForProperty(data) {
        return this.propertyService.updateImageForProperty(data.propertyId, data.image);
    }
    async getPropertyByPlace(data) {
        return this.propertyService.getPropertyByPlace(data.place);
    }
    async getDistinctPlace() {
        return this.propertyService.getDistinctPlace();
    }
    async getRateOfProperties() {
        return this.propertyService.getRateOfProperties();
    }
    async deletePropertyById(id, data, page = 1, limit = 5) {
        return this.propertyService.deletePropertyById(id, data.userId, page, limit);
    }
    async getPropertyAndPriceByDistance(distance, longitude, latitude, data) {
        return this.propertyService.getPropertyAndPriceByDistance(longitude, latitude, data.check_in, data.check_out, distance);
    }
};
exports.PropertyController = PropertyController;
__decorate([
    (0, common_1.Post)('/createPropertyWithPartner'),
    (0, common_1.UseGuards)(validateToken_guard_1.ValidateTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.ROLE.ADMIN, role_enum_1.ROLE.PARTNER),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)({
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = path.extname(file.originalname);
                const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "createPropertyWithPartner", null);
__decorate([
    (0, common_1.Post)('/updatePropertyWithPartner'),
    (0, common_1.UseGuards)(validateToken_guard_1.ValidateTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.ROLE.ADMIN, role_enum_1.ROLE.PARTNER),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)({
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = path.extname(file.originalname);
                const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "updatePropertyWithPartner", null);
__decorate([
    (0, common_1.Get)('/getAllProperty'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getAllProperty", null);
__decorate([
    (0, common_1.Get)('/getPropetyWithOwner/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropetyWithOwner", null);
__decorate([
    (0, common_1.Get)('/getPropertyById/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropertyById", null);
__decorate([
    (0, common_1.Get)('getPropertiesSortedByRate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropertiesSortedByRate", null);
__decorate([
    (0, common_1.Post)('getPropertyTypesByPlace'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropertyTypesByPlace", null);
__decorate([
    (0, common_1.Post)('getPropertyByTypeAndPlace'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropertyByTypeAndPlace", null);
__decorate([
    (0, common_1.Get)('getAllTypeOfProperties'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getAllTypeOfProperties", null);
__decorate([
    (0, common_1.Post)('getPropertyNear'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropertyNear", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, validateToken_guard_1.ValidateTokenGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.ROLE.PARTNER, role_enum_1.ROLE.ADMIN),
    (0, common_1.Put)('updateImageForProperty'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "updateImageForProperty", null);
__decorate([
    (0, common_1.Post)('getPropertyByPlace'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropertyByPlace", null);
__decorate([
    (0, common_1.Get)('getDistinctPlace'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getDistinctPlace", null);
__decorate([
    (0, common_1.Get)('getRateOfProperties'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getRateOfProperties", null);
__decorate([
    (0, common_1.Post)('deletePropertyById/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Number, Number]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "deletePropertyById", null);
__decorate([
    (0, common_1.Post)('getPropertyAndPriceByDistance'),
    __param(0, (0, common_1.Query)('distance')),
    __param(1, (0, common_1.Query)('longitude')),
    __param(2, (0, common_1.Query)('latitude')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropertyAndPriceByDistance", null);
exports.PropertyController = PropertyController = __decorate([
    (0, common_1.Controller)('property'),
    __metadata("design:paramtypes", [property_service_1.PropertyService])
], PropertyController);
//# sourceMappingURL=property.controller.js.map