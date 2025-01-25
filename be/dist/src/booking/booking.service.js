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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const booking_schema_1 = require("./booking.schema");
const mongoose_2 = require("mongoose");
const session_schema_1 = require("../session/session.schema");
const session_service_1 = require("../session/session.service");
const promotion_schema_1 = require("../promotion/promotion.schema");
const room_schema_1 = require("../room/room.schema");
const promotion_service_1 = require("../promotion/promotion.service");
const notification_gateway_1 = require("../notification/notification/notification.gateway");
const notification_service_1 = require("../notification/notification.service");
const bookingStatus_enum_1 = require("./enum/bookingStatus.enum");
const paymentStatus_enum_1 = require("./enum/paymentStatus.enum");
const gmail_service_1 = require("../gmail/gmail.service");
let BookingService = class BookingService {
    constructor(bookingSchema, sessionSchema, sessionService, promotionSchema, roomSchema, promotionService, notificationGateway, notificationService, gmailService) {
        this.bookingSchema = bookingSchema;
        this.sessionSchema = sessionSchema;
        this.sessionService = sessionService;
        this.promotionSchema = promotionSchema;
        this.roomSchema = roomSchema;
        this.promotionService = promotionService;
        this.notificationGateway = notificationGateway;
        this.notificationService = notificationService;
        this.gmailService = gmailService;
    }
    async getBookingById(booking_id) {
        const findBooking = await this.bookingSchema.aggregate([
            {
                $match: {
                    _id: new mongoose_2.Types.ObjectId(booking_id),
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            {
                $unwind: '$userDetails',
            },
            {
                $lookup: {
                    from: 'rooms',
                    localField: 'room_id',
                    foreignField: '_id',
                    as: 'roomDetails',
                },
            },
            {
                $unwind: '$roomDetails',
            },
            {
                $lookup: {
                    from: 'properties',
                    localField: 'property',
                    foreignField: '_id',
                    as: 'propertyDetails',
                },
            },
            {
                $unwind: '$propertyDetails',
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'propertyDetails.owner_id',
                    foreignField: '_id',
                    as: 'ownerDetails',
                },
            },
            {
                $unwind: {
                    path: '$ownerDetails',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);
        if (!findBooking) {
            throw new common_1.NotFoundException(`Booking with ID ${booking_id} not found`);
        }
        return findBooking;
    }
    async cancelBooking(booking_id) {
        const booking = await this.getBookingById(booking_id);
        if (booking[0].booking_status === bookingStatus_enum_1.BookingStatus.PENDING) {
            await this.bookingSchema.findByIdAndDelete(new mongoose_2.Types.ObjectId(booking_id));
        }
        else if (booking[0].booking_status === bookingStatus_enum_1.BookingStatus.COMPLETED &&
            booking[0].payment_status === paymentStatus_enum_1.PaymentStatus.PAID) {
            const formattedCheckInDate = new Date(booking[0].check_in_date);
            const currentDate = new Date();
            const timeDifference = formattedCheckInDate.getTime() - currentDate.getTime();
            const daysDifference = timeDifference / (1000 * 3600 * 24);
            const subject = 'Booking Cancellation Confirmation';
            const text = `Your booking has been cancelled. Here are the details:
          - Property: ${booking[0].property.name}
          - Room(s): ${Array.isArray(booking[0].roomDetails) ? booking[0].roomDetails?.map((room) => room.name).join(', ') : booking[0].roomDetails.name}
          - Check-in Date: ${booking[0].check_in_date.toDateString()}
          - Check-out Date: ${booking[0].check_out_date.toDateString()}
          - Refund Amount: $${booking[0].total_price}`;
            const cancelUrl = `${process.env.BACK_END_URL}/booking/confirm-cancellation?booking_id=${booking[0]._id}&redirect=${process.env.FRONT_END_URL}`;
            const html = `
          <h1>Booking Cancellation Confirmation</h1>
          <p>We received your request to cancel the booking. Here are the details:</p>
          <ul>
            <li><strong>Property:</strong> ${booking[0].propertyDetails.name}</li>
            <li><strong>Room(s):</strong> ${Array.isArray(booking[0].roomDetails) ? booking[0].roomDetails?.map((room) => room.name).join(', ') : booking[0].roomDetails.name}</li>
            <li><strong>Check-in Date:</strong> ${booking[0].check_in_date.toDateString()}</li>
            <li><strong>Check-out Date:</strong> ${booking[0].check_out_date.toDateString()}</li>
            <li><strong>Refund Amount:</strong> $${booking[0].total_price}</li>
          </ul>
          <p>Please click the button below to confirm cancellation</p>
          <a href="${cancelUrl}" style="
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          color: white;
          background-color: red;
          text-decoration: none;
          border-radius: 5px;
        ">Confirm Cancellation</a>
        <p>If you did not request this action, you can safely ignore this email.</p>
          <p>We hope to serve you again in the future.</p>
        `;
            await this.gmailService.sendEmail(booking[0].userDetails.email, subject, text, html);
        }
    }
    async finalizeCancellation(bookingId) {
        const booking = await this.getBookingById(bookingId);
        const message = `Your property ${booking[0].propertyDetails.name} has been canceled by ${booking[0].userDetails.email}`;
        await this.notificationService.createNotification({
            sender_id: booking[0].userDetails._id,
            receiver_id: booking[0].propertyDetails.owner_id,
            booking_id: booking[0]._id,
            type: 'Booking',
            message,
        });
        await this.bookingSchema.findByIdAndUpdate(new mongoose_2.Types.ObjectId(bookingId), {
            booking_status: bookingStatus_enum_1.BookingStatus.CANCELED,
        }, {
            new: true,
        });
        await this.notificationGateway.sendNotificationToPartner(booking[0].ownerDetails._id.toString(), message);
        return true;
    }
    async calculateTotalNightPriceForReservation(booking) {
        let totalNightPrice = 0;
        const checkInDate = new Date(booking.check_in_date);
        const checkOutDate = new Date(booking.check_out_date);
        await Promise.all(booking.rooms.map(async (room) => {
            const findRoom = await this.roomSchema.findById(room.roomId);
            const pricePerNightWeekday = findRoom.price_per_night.weekday;
            const pricePerNightWeekend = findRoom.price_per_night.weekend;
            const currentDate = new Date(checkInDate);
            while (currentDate < checkOutDate) {
                const dayOfWeek = currentDate.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                totalNightPrice += isWeekend
                    ? pricePerNightWeekend
                    : pricePerNightWeekday;
                currentDate.setDate(currentDate.getDate() + 1);
            }
            if (parseInt(room.numberOfRooms) > 0) {
                totalNightPrice *= parseInt(room.numberOfRooms);
            }
        }));
        return totalNightPrice;
    }
    async calculateTotalNightPrice(booking) {
        const findRoomPromotion = await this.promotionService.findRoomPromotionForBooking(booking.room_id);
        const findPropertyPromotion = await this.promotionService.findPropertyPromotionForBooking(booking.property);
        let totalNightPrice = 0;
        const checkInDate = new Date(booking.check_in_date);
        const checkOutDate = new Date(booking.check_out_date);
        await Promise.all(booking.room_id.map(async (roomId) => {
            const findRoom = await this.roomSchema.findById(roomId);
            const pricePerNightWeekday = findRoom.price_per_night.weekday;
            const pricePerNightWeekend = findRoom.price_per_night.weekend;
            const currentDate = new Date(checkInDate);
            while (currentDate < checkOutDate) {
                const dayOfWeek = currentDate.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                if (findRoomPromotion &&
                    currentDate >= new Date(findRoomPromotion.startDate) &&
                    currentDate <= new Date(findRoomPromotion.endDate)) {
                    if (isWeekend) {
                        totalNightPrice +=
                            pricePerNightWeekend *
                                (1 - findRoomPromotion.discountPercentage / 100);
                    }
                    else {
                        totalNightPrice +=
                            pricePerNightWeekday *
                                (1 - findRoomPromotion.discountPercentage / 100);
                    }
                }
                else if (findPropertyPromotion &&
                    currentDate >= new Date(findPropertyPromotion.startDate) &&
                    currentDate <= new Date(findPropertyPromotion.endDate)) {
                    if (isWeekend) {
                        totalNightPrice +=
                            pricePerNightWeekend *
                                (1 - findPropertyPromotion.discountPercentage / 100);
                    }
                    else {
                        totalNightPrice +=
                            pricePerNightWeekday *
                                (1 - findPropertyPromotion.discountPercentage / 100);
                    }
                }
                else {
                    totalNightPrice += isWeekend
                        ? pricePerNightWeekend
                        : pricePerNightWeekday;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }));
        return totalNightPrice;
    }
    async createBookingWithAdmin(createBookingDto) {
        const newBooking = new this.bookingSchema(createBookingDto);
        return await newBooking.save();
    }
    async createBooking(createBookingDto) {
        const customerId = createBookingDto.user_id;
        const findExistedBooking = await this.bookingSchema
            .findOne({
            user_id: new mongoose_2.Types.ObjectId(customerId),
        })
            .populate('user_id');
        if (findExistedBooking) {
            if (findExistedBooking.booking_status === bookingStatus_enum_1.BookingStatus.PENDING) {
                throw new common_1.BadRequestException('');
            }
        }
        const newBooking = new this.bookingSchema(createBookingDto);
        const savedBooking = await newBooking.save();
        await Promise.all(createBookingDto.roomData.map(async (room) => {
            await this.bookingSchema.findByIdAndUpdate(savedBooking._id, {
                $addToSet: {
                    room_id: room.roomId,
                },
            });
            await this.roomSchema.findByIdAndUpdate(room.roomId, {
                $inc: { 'capacity.room': parseInt(room.numberOfRooms) },
            });
        }));
        if (savedBooking) {
            const findPartnerId = await this.roomSchema
                .findOne({
                property_id: createBookingDto.property,
            })
                .populate({
                path: 'property_id',
                populate: 'owner_id',
            });
            const partnerId = findPartnerId.property_id.owner_id;
            const message = `Your property ${findPartnerId.property_id.name} has been booked by ${findExistedBooking.user_id.email}`;
            await this.notificationService.createNotification({
                sender_id: new mongoose_2.Types.ObjectId(customerId),
                receiver_id: partnerId,
                booking_id: new mongoose_2.Types.ObjectId(savedBooking._id),
                type: 'Booking',
                message,
            });
            await this.notificationGateway.sendNotificationToPartner(createBookingDto.partnerId.toString(), message);
            await this.bookingSchema.findByIdAndUpdate(savedBooking._id, {
                total_price: createBookingDto.totalPrice,
            });
            await this.sessionSchema.findOneAndUpdate({
                userId: createBookingDto.user_id,
            }, {
                $addToSet: {
                    lastBooking: savedBooking._id,
                },
            });
            return savedBooking;
        }
    }
    async checkFullRoom(room_id) {
        const findFullRoom = await this.roomSchema.findById(room_id);
        if (findFullRoom) {
            if (findFullRoom.capacity.room > 0) {
                return false;
            }
        }
        return true;
    }
    async findConflictingBookings(property, roomId, check_in, check_out) {
        const conflictingBookings = await this.bookingSchema.find({
            $and: [
                {
                    property: property.toString(),
                },
                { room_id: roomId.toString() },
                {
                    $or: [
                        {
                            check_in_date: { $lte: check_out },
                            check_out_date: { $gte: check_in },
                        },
                    ],
                },
            ],
        });
        const conflictingRoomIds = conflictingBookings.map((booking) => booking.room_id.toString());
        return conflictingRoomIds;
    }
    async getMonthlyRevenueByOwner(owner_id) {
        const objectIdOwnerId = new mongoose_2.Types.ObjectId(owner_id);
        const result = await this.bookingSchema.aggregate([
            {
                $match: {
                    booking_status: 'Completed',
                },
            },
            {
                $lookup: {
                    from: 'properties',
                    localField: 'property',
                    foreignField: '_id',
                    as: 'propertyDetails',
                },
            },
            { $unwind: '$propertyDetails' },
            {
                $match: {
                    'propertyDetails.owner_id': objectIdOwnerId,
                },
            },
            {
                $project: {
                    owner_id: '$propertyDetails.owner_id',
                    check_in_date: 1,
                    check_out_date: 1,
                    total_price: 1,
                    duration: {
                        $divide: [
                            { $subtract: ['$check_out_date', '$check_in_date'] },
                            1000 * 60 * 60 * 24,
                        ],
                    },
                },
            },
            {
                $addFields: {
                    dailyRevenue: { $divide: ['$total_price', '$duration'] },
                },
            },
            {
                $project: {
                    owner_id: 1,
                    days: { $range: [0, { $toInt: '$duration' }] },
                    check_in_date: 1,
                    dailyRevenue: 1,
                },
            },
            { $unwind: '$days' },
            {
                $group: {
                    _id: {
                        owner_id: '$owner_id',
                        year: {
                            $year: {
                                $add: [
                                    '$check_in_date',
                                    { $multiply: ['$days', 1000 * 60 * 60 * 24] },
                                ],
                            },
                        },
                        month: {
                            $month: {
                                $add: [
                                    '$check_in_date',
                                    { $multiply: ['$days', 1000 * 60 * 60 * 24] },
                                ],
                            },
                        },
                    },
                    monthlyRevenue: { $sum: '$dailyRevenue' },
                },
            },
            {
                $group: {
                    _id: { owner_id: '$_id.owner_id', year: '$_id.year' },
                    monthlyRevenues: {
                        $push: {
                            month: '$_id.month',
                            revenue: '$monthlyRevenue',
                        },
                    },
                    yearlyRevenue: { $sum: '$monthlyRevenue' },
                },
            },
            { $sort: { '_id.year': 1 } },
        ]);
        return result.map((item) => ({
            owner_id: item._id.owner_id,
            year: item._id.year,
            monthlyRevenues: item.monthlyRevenues,
            yearlyRevenue: item.yearlyRevenue,
        }));
    }
    async getMonthlyRevenueByProperty(propety_id) {
        const objectIdPropertyId = new mongoose_2.Types.ObjectId(propety_id);
        console.log(objectIdPropertyId);
        const result = await this.bookingSchema.aggregate([
            {
                $match: {
                    booking_status: 'Completed',
                },
            },
            {
                $lookup: {
                    from: 'properties',
                    localField: 'property',
                    foreignField: '_id',
                    as: 'propertyDetails',
                },
            },
            { $unwind: '$propertyDetails' },
            {
                $match: {
                    'propertyDetails._id': objectIdPropertyId,
                },
            },
            {
                $project: {
                    property_id: '$propertyDetails._id',
                    check_in_date: 1,
                    check_out_date: 1,
                    total_price: 1,
                    duration: {
                        $divide: [
                            { $subtract: ['$check_out_date', '$check_in_date'] },
                            1000 * 60 * 60 * 24,
                        ],
                    },
                },
            },
            {
                $addFields: {
                    dailyRevenue: { $divide: ['$total_price', '$duration'] },
                },
            },
            {
                $project: {
                    property_id: 1,
                    days: { $range: [0, { $toInt: '$duration' }] },
                    check_in_date: 1,
                    dailyRevenue: 1,
                },
            },
            { $unwind: '$days' },
            {
                $group: {
                    _id: {
                        property_id: '$property_id',
                        year: {
                            $year: {
                                $add: [
                                    '$check_in_date',
                                    { $multiply: ['$days', 1000 * 60 * 60 * 24] },
                                ],
                            },
                        },
                        month: {
                            $month: {
                                $add: [
                                    '$check_in_date',
                                    { $multiply: ['$days', 1000 * 60 * 60 * 24] },
                                ],
                            },
                        },
                    },
                    monthlyRevenue: { $sum: '$dailyRevenue' },
                },
            },
            {
                $group: {
                    _id: { property_id: '$_id.property_id', year: '$_id.year' },
                    monthlyRevenues: {
                        $push: {
                            month: '$_id.month',
                            revenue: '$monthlyRevenue',
                        },
                    },
                    yearlyRevenue: { $sum: '$monthlyRevenue' },
                },
            },
            { $sort: { '_id.year': 1 } },
        ]);
        return result.map((item) => ({
            owner_id: item._id.owner_id,
            year: item._id.year,
            monthlyRevenues: item.monthlyRevenues,
            yearlyRevenue: item.yearlyRevenue,
        }));
    }
    async getBookingByOwner(owner_id) {
        return this.bookingSchema.aggregate([
            {
                $lookup: {
                    from: 'properties',
                    localField: 'property',
                    foreignField: '_id',
                    as: 'propertyDetails',
                },
            },
            {
                $unwind: '$propertyDetails',
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            {
                $match: {
                    'propertyDetails.owner_id': new mongoose_2.Types.ObjectId(owner_id),
                },
            },
            {
                $lookup: {
                    from: 'rooms',
                    localField: 'room_id',
                    foreignField: '_id',
                    as: 'roomDetails',
                },
            },
            {
                $project: {
                    _id: 1,
                    check_in_date: 1,
                    check_out_date: 1,
                    total_price: 1,
                    booking_status: 1,
                    capacity: 1,
                    propertyDetails: 1,
                    roomDetails: 1,
                    userDetails: 1,
                },
            },
        ]);
    }
    async updateBookingStatus(bookingId, data) {
        const updateBooking = await this.bookingSchema.findByIdAndUpdate(bookingId, { $set: data }, { new: true });
        console.log(updateBooking);
        if (!updateBooking) {
            throw new common_1.NotFoundException(`Booking with ID ${bookingId} not found`);
        }
        return updateBooking;
    }
    async findUnfinishedBooking(userId) {
        const findBooking = await this.bookingSchema.aggregate([
            {
                $match: {
                    user_id: new mongoose_2.Types.ObjectId(userId),
                    booking_status: bookingStatus_enum_1.BookingStatus.PENDING,
                },
            },
            {
                $lookup: {
                    from: 'rooms',
                    localField: 'room_id',
                    foreignField: '_id',
                    as: 'roomDetails',
                },
            },
            {
                $unwind: '$roomDetails',
            },
            {
                $lookup: {
                    from: 'properties',
                    localField: 'property',
                    foreignField: '_id',
                    as: 'propertyDetails',
                },
            },
            {
                $unwind: '$propertyDetails',
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            {
                $unwind: '$userDetails',
            },
        ]);
        return findBooking;
    }
    async getAllBooking() {
        return await this.bookingSchema
            .find({})
            .populate('user_id')
            .populate('room_id')
            .populate('property');
    }
    async deleteBookingById(bookingId) {
        return await this.bookingSchema.findByIdAndDelete(new mongoose_2.Types.ObjectId(bookingId));
    }
    async updateBookingById(bookingId, bookingDto) {
        return await this.bookingSchema.findByIdAndUpdate(new mongoose_2.Types.ObjectId(bookingId), bookingDto);
    }
    async getCompletedAndCancelledBookingByUser(userId) {
        return await this.bookingSchema
            .find({
            user_id: new mongoose_2.Types.ObjectId(userId),
            $or: [
                {
                    booking_status: bookingStatus_enum_1.BookingStatus.COMPLETED,
                },
                {
                    booking_status: bookingStatus_enum_1.BookingStatus.CANCELED,
                },
            ],
        })
            .populate('property')
            .populate('room_id')
            .populate('user_id');
    }
    async getById(bookingId) {
        return await this.bookingSchema.findById(new mongoose_2.Types.ObjectId(bookingId));
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(1, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __param(3, (0, mongoose_1.InjectModel)(promotion_schema_1.Promotion.name)),
    __param(4, (0, mongoose_1.InjectModel)(room_schema_1.Room.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        session_service_1.SessionService,
        mongoose_2.Model,
        mongoose_2.Model,
        promotion_service_1.PromotionService,
        notification_gateway_1.NotificationGateway,
        notification_service_1.NotificationService,
        gmail_service_1.GmailService])
], BookingService);
//# sourceMappingURL=booking.service.js.map