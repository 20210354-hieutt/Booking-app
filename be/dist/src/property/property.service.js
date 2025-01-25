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
exports.PropertyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const property_schema_1 = require("./property.schema");
const mongoose_2 = require("mongoose");
const booking_service_1 = require("../booking/booking.service");
const room_service_1 = require("../room/room.service");
const review_schema_1 = require("../review/review.schema");
const review_service_1 = require("../review/review.service");
const cloudinary_1 = require("cloudinary");
const fs = __importStar(require("fs"));
cloudinary_1.v2.config({
    cloud_name: 'du4fzcfok',
    api_key: '428412499929535',
    api_secret: 'Wa3YxNkGg5sr5poKRILhGcIk9XU',
});
let PropertyService = class PropertyService {
    constructor(propertySchema, bookingService, roomService, reviewSchema, reviewService) {
        this.propertySchema = propertySchema;
        this.bookingService = bookingService;
        this.roomService = roomService;
        this.reviewSchema = reviewSchema;
        this.reviewService = reviewService;
    }
    async uploadImageToCloudinary(filePath) {
        try {
            console.log(filePath);
            const result = await cloudinary_1.v2.uploader.upload(filePath);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Failed to delete local file:', err.message);
                }
                else {
                    console.log('Successfully deleted local file:', filePath);
                }
            });
            return result.secure_url;
        }
        catch (error) {
            throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
        }
    }
    async getPublicIdFromUrl(url) {
        const parts = url.split('/');
        const fileWithExtension = parts[parts.length - 1];
        return fileWithExtension.split('.')[0];
    }
    async checkImageExistsOnCloudinary(url) {
        const publicId = await this.getPublicIdFromUrl(url);
        try {
            await cloudinary_1.v2.api.resource(publicId);
            return true;
        }
        catch (error) {
            if (error.http_code === 404) {
                return false;
            }
            else {
                throw error;
            }
        }
    }
    async appendImageFile(images, newImages) {
        const validImages = [];
        if (images) {
            await Promise.all(images.map(async (image) => {
                try {
                    const isValidImage = await this.checkImageExistsOnCloudinary(image);
                    if (isValidImage) {
                        validImages.push(image);
                    }
                }
                catch (err) { }
            }));
        }
        if (newImages && newImages.length !== 0) {
            if (newImages[0]?.path) {
                newImages.forEach((image) => {
                    validImages.push(image.path);
                });
            }
            else {
                newImages.forEach((image) => {
                    validImages.push(image);
                });
            }
        }
        return validImages;
    }
    async updateProperty(property) {
        if (property.image) {
            const propertyImageUrls = await Promise.all(property.image.map((imagePath) => {
                if (imagePath) {
                    return this.uploadImageToCloudinary(imagePath);
                }
            }));
            const roomImageUrls = await Promise.all(property.rooms.map(async (room) => {
                const roomImages = await Promise.all(room.image.map((imagePath) => {
                    if (imagePath) {
                        return this.uploadImageToCloudinary(imagePath.path);
                    }
                }));
                return {
                    ...room,
                    image: roomImages,
                };
            }));
            const newImages = await this.appendImageFile(property.images, propertyImageUrls);
            property.images = newImages;
            await Promise.all(property.rooms.map(async (room, index) => {
                const newImage = await this.appendImageFile(room.images, roomImageUrls[index].image);
                room.images = newImage;
            }));
            const propertyData = {
                ...property,
                images: property.images,
                rooms: property.rooms.map((room) => ({
                    ...room,
                    images: room.images || null,
                })),
            };
            const savedProperty = await this.propertySchema.findByIdAndUpdate(propertyData._id, propertyData, {
                new: true,
            });
            propertyData.rooms.map(async (value) => {
                value.capacity = JSON.parse(value.capacity);
                value.price_per_night = JSON.parse(value.price_per_night);
                value.size = parseInt(value.size);
                value.images = Array.isArray(value.images)
                    ? value.images
                    : [value.images];
                value.price_per_night = value.price_per_night;
                value.property_id = savedProperty._id;
                await this.roomService.updateRoom(value);
            });
        }
        else {
            const propertyData = {
                ...property,
                images: property.images,
                rooms: property.rooms.map((room) => ({
                    ...room,
                    images: room.images || null,
                })),
            };
            const savedProperty = await this.propertySchema.findByIdAndUpdate(propertyData._id, propertyData, {
                new: true,
            });
            propertyData.rooms.map(async (value) => {
                value.capacity = JSON.parse(value.capacity);
                value.price_per_night = JSON.parse(value.price_per_night);
                value.size = parseInt(value.size);
                value.images = Array.isArray(value.images)
                    ? value.images
                    : [value.images];
                value.price_per_night = value.price_per_night;
                value.property_id = savedProperty._id;
                await this.roomService.updateRoom(value);
            });
            return savedProperty;
        }
    }
    async createNewProperty(property) {
        const propertyImageUrl = await Promise.all(property.image.map((imagePath) => {
            if (imagePath) {
                return this.uploadImageToCloudinary(imagePath);
            }
        }));
        const roomImageUrls = await Promise.all(property.rooms.map(async (room) => {
            const roomImages = await Promise.all(room.image.map((imagePath) => {
                if (imagePath) {
                    return this.uploadImageToCloudinary(imagePath.path);
                }
            }));
            return {
                ...room,
                images: roomImages,
            };
        }));
        if (property.rooms) {
            const propertyData = {
                ...property,
                images: propertyImageUrl,
                rooms: property.rooms.map((room, index) => ({
                    ...room,
                    images: roomImageUrls[index] || null,
                })),
            };
            if (!propertyData._id || propertyData._id === 'undefined') {
                delete propertyData._id;
            }
            const newProperty = new this.propertySchema(propertyData);
            const savedProperty = await newProperty.save();
            propertyData.rooms.map(async (value) => {
                value.capacity = JSON.parse(value.capacity);
                value.price_per_night = JSON.parse(value.price_per_night);
                value.size = parseInt(value.size);
                value.images = value.images.images;
                value.price_per_night = value.price_per_night;
                value.property_id = savedProperty._id;
                await this.roomService.createRoom(value);
            });
            return savedProperty;
        }
        else {
            const propertyData = {
                ...property,
                images: propertyImageUrl,
                rooms: [],
            };
            if (!propertyData._id || propertyData._id === 'undefined') {
                delete propertyData._id;
            }
            const newProperty = new this.propertySchema(propertyData);
            const savedProperty = await newProperty.save();
            return savedProperty;
        }
    }
    async getAllProperty() {
        return this.propertySchema.find().populate('owner_id');
    }
    async getPropertyWithOwner(owner_id, page, limit = 5) {
        const properties = [];
        const skip = (page - 1) * limit;
        const findProperty = await this.propertySchema
            .find({
            owner_id: owner_id,
        })
            .limit(limit)
            .skip(skip)
            .populate('owner_id')
            .exec();
        const total = await this.propertySchema.countDocuments({
            owner_id: owner_id,
        });
        const totalPages = Math.ceil(total / limit);
        await Promise.all(findProperty.map(async (property) => {
            const totalRoom = await this.roomService.countRoomWithPropety(property._id);
            properties.push({
                totalRoom,
                property,
            });
        }));
        return {
            properties,
            totalPages,
            currentPage: page,
        };
    }
    async getPropertyById(id) {
        return this.propertySchema
            .findById(new mongoose_2.Types.ObjectId(id))
            .populate({ path: 'owner_id' });
    }
    async getPropertiesSortedByRate() {
        const properties = await this.propertySchema
            .find()
            .sort({ rate: -1 })
            .limit(4);
        const propertiesWithRate = [];
        await Promise.all(properties.map(async (property) => {
            const review = await this.reviewService.countReviewWithProperty(property._id.toString());
            propertiesWithRate.push({
                property,
                numberReviews: review,
            });
        }));
        return propertiesWithRate;
    }
    async getPropertyTypesByPlace(province) {
        return this.propertySchema.distinct('property_type', {
            'address.province': province,
        });
    }
    async getPropertyByTypeAndPlace(place, type) {
        return this.propertySchema.find({
            'address.province': place,
            property_type: type,
        });
    }
    async getRateOfProperties() {
        const findRate = await this.propertySchema.aggregate([
            {
                $group: {
                    _id: '$rate',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    rate: '$_id',
                    count: 1,
                    _id: 0,
                },
            },
        ]);
        const formattedRate = findRate.map(({ count, rate }) => ({
            count,
            rate: Math.ceil(rate),
        }));
        return formattedRate;
    }
    async getAllTypeOfProperties() {
        return this.propertySchema.aggregate([
            {
                $group: {
                    _id: '$property_type',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    name: '$_id',
                    count: 1,
                    _id: 0,
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const EARTH_RADIUS = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) *
                Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS * c;
    }
    async getPropertyAndPriceByDistance(longitude, latitude, check_in, check_out, userDistance) {
        const properties = await this.propertySchema.find({});
        const perfectProperties = [];
        const uniqueMap = new Map();
        for (const property of properties) {
            const findAvailableRoom = await this.roomService.findAvailableRoomWithProperty(property._id);
            for (const value of findAvailableRoom) {
                const finalRespone = await this.roomService.findConflictingInBookings(value._id, property._id, check_in, check_out);
                if (finalRespone.length === 0) {
                    const totalPriceNight = await this.bookingService.calculateTotalNightPrice({
                        room_id: [value._id],
                        property: property._id,
                        check_in_date: check_in,
                        check_out_date: check_out,
                    });
                    const distance = this.calculateDistance(latitude, longitude, property.location.latitude, property.location.longitude);
                    const roundedNumber = distance.toFixed(1);
                    if (distance <= userDistance) {
                        perfectProperties.push({
                            distance: roundedNumber,
                            value,
                            totalPriceNight,
                        });
                        const propertyId = property._id;
                        if (!uniqueMap.has(propertyId)) {
                            uniqueMap.set(propertyId, {
                                distance: roundedNumber,
                                value,
                                totalPriceNight,
                            });
                            console.log(uniqueMap);
                        }
                    }
                }
            }
        }
        const uniquedProperties = Array.from(uniqueMap.values());
        console.log(uniquedProperties);
        return uniquedProperties;
    }
    async getPropertyNear(longitude, latitude) {
        const properties = await this.propertySchema.find({});
        const perfectProperties = [];
        const nearbyProperties = properties.filter((property) => {
            const distance = this.calculateDistance(latitude, longitude, property.location.latitude, property.location.longitude);
            const roundedNumber = distance.toFixed(1);
            if (distance <= 5) {
                perfectProperties.push({
                    distance: roundedNumber,
                    property,
                });
            }
        });
        return perfectProperties;
    }
    async updateImageForProperty(propertyId, image) {
        return await this.propertySchema.findByIdAndUpdate(propertyId, {
            $push: {
                images: {
                    $each: image,
                },
            },
        }, {
            new: true,
        });
    }
    async getPropertyByPlace(place) {
        return await this.propertySchema.find({
            'address.province': place,
        });
    }
    async getDistinctPlace() {
        return this.propertySchema.distinct('address.province');
    }
    async deletePropertyById(property_id, owner_id, page, limit) {
        await this.propertySchema.findByIdAndDelete(new mongoose_2.Types.ObjectId(property_id), {
            new: true,
        });
        const newPropertiesList = await this.getPropertyWithOwner(owner_id, page, limit);
        return newPropertiesList;
    }
};
exports.PropertyService = PropertyService;
exports.PropertyService = PropertyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(property_schema_1.Property.name)),
    __param(3, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        booking_service_1.BookingService,
        room_service_1.RoomService,
        mongoose_2.Model,
        review_service_1.ReviewService])
], PropertyService);
//# sourceMappingURL=property.service.js.map