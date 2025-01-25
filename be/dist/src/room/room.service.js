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
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const room_schema_1 = require("./room.schema");
const mongoose_2 = __importStar(require("mongoose"));
const review_schema_1 = require("../review/review.schema");
const booking_service_1 = require("../booking/booking.service");
const property_schema_1 = require("../property/property.schema");
const session_schema_1 = require("../session/session.schema");
const booking_schema_1 = require("../booking/booking.schema");
const validateToken_guard_1 = require("../common/guards/validateToken.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const role_enum_1 = require("../user/enum/role.enum");
let RoomService = class RoomService {
    constructor(roomSchema, propertySchema, reviewSchema, bookingService, sessionSchema, bookingSchema) {
        this.roomSchema = roomSchema;
        this.propertySchema = propertySchema;
        this.reviewSchema = reviewSchema;
        this.bookingService = bookingService;
        this.sessionSchema = sessionSchema;
        this.bookingSchema = bookingSchema;
    }
    async createRoom(createRoomDto) {
        const newRoom = new this.roomSchema(createRoomDto);
        return newRoom.save();
    }
    async updateRoom(room) {
        if (!room._id || room._id === 'undefined') {
            delete room._id;
        }
        if (room._id) {
            const findRoom = await this.roomSchema.findById(room._id);
            if (!findRoom) {
                throw new Error('Room not found');
            }
            return await findRoom.updateOne(room);
        }
        else {
            const newRoom = new this.roomSchema(room);
            const savedRoom = await newRoom.save();
            return savedRoom;
        }
    }
    async deleteRoom(id) {
        return await this.roomSchema.findByIdAndDelete(id);
    }
    async countRoomWithPropety(property_id) {
        return await this.roomSchema.countDocuments({ property_id });
    }
    async getAllRoomWithDetails() {
        return this.roomSchema.find().populate({
            path: 'property_id',
            populate: {
                path: 'owner_id',
            },
        });
    }
    async getRoomWithPriceByProperty(property_id, check_out, check_in) {
        const findProperty = await this.propertySchema.findById(new mongoose_2.Types.ObjectId(property_id));
        const availableRoom = [];
        const findAvailableRoom = await this.findAvailableRoomWithProperty(findProperty._id);
        await Promise.all(findAvailableRoom.map(async (room) => {
            const totalPriceNight = await this.bookingService.calculateTotalNightPrice({
                room_id: [room._id],
                property: findProperty._id,
                check_in_date: check_in,
                check_out_date: check_out,
            });
            availableRoom.push({ room, totalPriceNight });
        }));
        return availableRoom;
    }
    async getAllRoomWithTotalPrice({ check_in, check_out, capacity, userId, place, }) {
        const uniqueMap = new Map();
        const availableRoom = await this.findAvailableRoomWithSearch(userId, place, check_in, check_out, capacity, null);
        availableRoom.forEach((item) => {
            const propertyId = item.value.property_id._id;
            if (!uniqueMap.has(propertyId)) {
                uniqueMap.set(propertyId, item);
            }
        });
        const uniquedProperties = Array.from(uniqueMap.values());
        return uniquedProperties;
    }
    async getRoomWithProperty(property_id) {
        return this.roomSchema
            .find({
            property_id,
        })
            .populate('property_id');
    }
    async findAvailableRoomWithProperty(property_id) {
        const existedRoom = await this.roomSchema
            .find({
            $and: [{ property_id: property_id }, { 'capacity.room': { $gt: 0 } }],
        })
            .populate('property_id');
        return existedRoom;
    }
    async isDuplicateSearch(recentSearch, newSearch) {
        return recentSearch.some((search) => {
            const isSameCheckIn = search.check_in && newSearch.checkIn
                ? search.check_in.getTime() === newSearch.checkIn.getTime()
                : false;
            const isSameCheckOut = search.check_out && newSearch.checkOut
                ? search.check_out.getTime() === newSearch.checkOut.getTime()
                : false;
            return (search.province === newSearch.place &&
                isSameCheckIn &&
                isSameCheckOut &&
                search.capacity.adults === newSearch.capacity.adults &&
                search.capacity.childs.count === newSearch.capacity.childs.count &&
                search.capacity.childs.age === newSearch.capacity.childs.age &&
                search.capacity.room === newSearch.capacity.room);
        });
    }
    async findAvailableRoomWithSearch(userId, place, check_in, check_out, capacity, type) {
        let findProperties;
        if (place === 'all') {
            findProperties = await this.propertySchema.find();
        }
        else if (type !== undefined && type !== null && type !== '') {
            findProperties = await this.propertySchema.find({
                property_type: type,
            });
        }
        else {
            findProperties = await this.propertySchema.find({
                'address.province': place,
            });
        }
        if (findProperties.length === 0) {
            findProperties = await this.propertySchema.find({
                name: { $regex: place, $options: 'i' },
            });
        }
        const availableRoom = [];
        await Promise.all(findProperties.map(async (property) => {
            const findAvailableRoom = await this.findAvailableRoomWithProperty(property._id);
            await Promise.all(findAvailableRoom.map(async (value) => {
                const finalRespone = await this.findConflictingInBookings(value._id, property._id, check_in, check_out);
                if (finalRespone.length === 0) {
                    const totalPriceNight = await this.bookingService.calculateTotalNightPrice({
                        room_id: [value._id],
                        property: property._id,
                        check_in_date: check_in,
                        check_out_date: check_out,
                    });
                    availableRoom.push({ value, totalPriceNight });
                }
            }));
        }));
        if (userId &&
            place != 'all' &&
            (type === null || type === undefined || type === '')) {
            const session = await this.sessionSchema.findOne({
                userId: new mongoose_2.Types.ObjectId(userId),
            });
            if (!session)
                throw new Error('Session not found');
            const isDuplicate = await this.isDuplicateSearch(session.recent_search, {
                place,
                capacity,
                checkIn: new Date(check_in),
                checkOut: new Date(check_out),
            });
            if (!isDuplicate) {
                await this.sessionSchema.findOneAndUpdate({
                    userId,
                }, {
                    $push: {
                        recent_search: {
                            $each: [{ province: place, check_in, check_out, capacity }],
                            $slice: -3,
                        },
                    },
                }, { new: true });
            }
        }
        return availableRoom;
    }
    async findConflictingInBookings(room_id, property_id, check_in, check_out) {
        const findRoomInBooking = await this.bookingService.findConflictingBookings(property_id, room_id, check_in, check_out);
        return findRoomInBooking;
    }
    async findRoom(findRoomDto) {
        const findRoom = await this.roomSchema.find({
            $and: [
                { 'capacity.adults': { $gte: findRoomDto.capacity.adults } },
                { 'capacity.childs.age': { $gte: findRoomDto.capacity.childs.age } },
                {
                    'capacity.childs.count': { $gte: findRoomDto.capacity.childs.count },
                },
                { 'capacity.room': { $gte: findRoomDto.capacity.room } },
                {
                    $or: [
                        {
                            'availability.check_out_date': { $lt: findRoomDto.check_in_date },
                        },
                        {
                            'availability.check_in_date': { $gt: findRoomDto.check_out_date },
                        },
                    ],
                },
                {
                    $or: [{ availability: null }, { availability: {} }],
                },
            ],
        });
        return findRoom;
    }
    async updateImageForRoom(roomId, image) {
        return await this.roomSchema.findByIdAndUpdate(roomId, {
            $push: {
                images: {
                    $each: image,
                },
            },
        }, { new: true });
    }
    async getMonthlyOccupancyRatesByOwner(ownerId, year) {
        const rooms = await this.roomSchema
            .find()
            .populate({
            path: 'property_id',
            match: { owner_id: new mongoose_2.default.Types.ObjectId(ownerId) },
        })
            .exec();
        const validRooms = rooms.filter((room) => room.property_id !== null);
        const totalRooms = validRooms.reduce((sum, room) => {
            return sum + (room.capacity.room || 0);
        }, 0);
        const bookings = await this.bookingSchema
            .find({
            booking_status: 'Completed',
        })
            .populate({
            path: 'property',
            match: { owner_id: new mongoose_2.default.Types.ObjectId(ownerId) },
        })
            .exec();
        const monthlyBookings = Array(12).fill(0);
        bookings.forEach((booking) => {
            const checkInMonth = booking.check_in_date.getMonth();
            const checkOutMonth = booking.check_out_date.getMonth();
            monthlyBookings[checkInMonth] += 1;
            if (checkOutMonth !== checkInMonth) {
                for (let month = checkInMonth + 1; month <= checkOutMonth; month++) {
                    monthlyBookings[month] += 1;
                }
            }
        });
        const occupancyRates = monthlyBookings.map((count, index) => {
            const occupancyRate = (count / totalRooms) * 100;
            return {
                month: index + 1,
                occupancyRate: parseFloat(occupancyRate.toFixed(2)),
            };
        });
        return occupancyRates;
    }
    async getMonthlyOccupancyRatesByProperty(property_id, year) {
        const rooms = await this.roomSchema
            .find()
            .populate({
            path: 'property_id',
            match: { _id: new mongoose_2.default.Types.ObjectId(property_id) },
        })
            .exec();
        const validRooms = rooms.filter((room) => room.property_id !== null);
        const totalRooms = validRooms.reduce((sum, room) => {
            return sum + (room.capacity.room || 0);
        }, 0);
        const bookings = await this.bookingSchema
            .find({
            booking_status: 'Completed',
        })
            .populate({
            path: 'property',
            match: { _id: new mongoose_2.default.Types.ObjectId(property_id) },
        })
            .exec();
        const monthlyBookings = Array(12).fill(0);
        bookings.forEach((booking) => {
            const checkInMonth = booking.check_in_date.getMonth();
            const checkOutMonth = booking.check_out_date.getMonth();
            monthlyBookings[checkInMonth] += 1;
            if (checkOutMonth !== checkInMonth) {
                for (let month = checkInMonth + 1; month <= checkOutMonth; month++) {
                    monthlyBookings[month] += 1;
                }
            }
        });
        const occupancyRates = monthlyBookings.map((count, index) => {
            const occupancyRate = (count / totalRooms) * 100;
            return {
                month: index + 1,
                occupancyRate: parseFloat(occupancyRate.toFixed(2)),
            };
        });
        return occupancyRates;
    }
    async findRoomInReservation(property_id, capacity, check_in_date, check_out_date) {
        const findProperty = await this.propertySchema.findById(new mongoose_2.Types.ObjectId(property_id));
        const availableRoom = [];
        const findAvailableRoom = await this.findAvailableRoomWithProperty(findProperty._id);
        await Promise.all(findAvailableRoom.map(async (value) => {
            const checkFullRoom = await this.bookingService.checkFullRoom(value._id.toString());
            if (value.capacity.adults >= capacity.adults &&
                value.capacity.childs.age >= capacity.childs.age &&
                value.capacity.childs.count >= capacity.childs.count) {
                if (checkFullRoom) {
                    const finalResponse = await this.findConflictingInBookings(value._id, findProperty._id, check_in_date, check_out_date);
                    if (finalResponse.length === 0) {
                        const totalPriceNight = await this.bookingService.calculateTotalNightPrice({
                            room_id: [value._id],
                            property: findProperty._id,
                            check_in_date: check_in_date,
                            check_out_date: check_out_date,
                        });
                        availableRoom.push({ value, totalPriceNight });
                    }
                }
                else {
                    const totalPriceNight = await this.bookingService.calculateTotalNightPrice({
                        room_id: [value._id],
                        property: findProperty._id,
                        check_in_date: check_in_date,
                        check_out_date: check_out_date,
                    });
                    availableRoom.push({
                        value,
                        totalPriceNight,
                        numberOfAvailableRooms: value.capacity.room,
                    });
                }
            }
        }));
        return availableRoom;
    }
    async getRoomById(roomId) {
        return await this.roomSchema
            .findById(new mongoose_2.Types.ObjectId(roomId))
            .populate({ path: 'property_id' });
    }
};
exports.RoomService = RoomService;
__decorate([
    (0, common_1.UseGuards)(validateToken_guard_1.ValidateTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.ROLE.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoomService.prototype, "getAllRoomWithDetails", null);
exports.RoomService = RoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(room_schema_1.Room.name)),
    __param(1, (0, mongoose_1.InjectModel)(property_schema_1.Property.name)),
    __param(2, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __param(4, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __param(5, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        booking_service_1.BookingService,
        mongoose_2.Model,
        mongoose_2.Model])
], RoomService);
//# sourceMappingURL=room.service.js.map