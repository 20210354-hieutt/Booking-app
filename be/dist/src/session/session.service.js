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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const session_schema_1 = require("./session.schema");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const user_schema_1 = require("../user/user.schema");
let SessionService = class SessionService {
    constructor(sessionSchema, jwtService, userSchema) {
        this.sessionSchema = sessionSchema;
        this.jwtService = jwtService;
        this.userSchema = userSchema;
    }
    async createSession(createSessionDto) {
        const { userId, lastViewProperties, lastBooking } = createSessionDto;
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const refreshToken = this.jwtService.sign({ userId: userId }, { expiresIn: '7d' });
        await this.sessionSchema.deleteMany({ userId });
        const newSession = new this.sessionSchema({
            userId: userId,
            lastViewProperties: lastViewProperties,
            lastBooking: lastBooking,
            expires_at: expiresAt,
            refreshToken,
            last_activity: Date.now(),
        });
        return newSession.save();
    }
    async getSession(id) {
        const { sessionId } = id;
        const session = await this.sessionSchema
            .findById(sessionId)
            .populate('userId')
            .exec();
        return session;
    }
    async getSessionByUserId(userId) {
        const session = await this.sessionSchema
            .findOne({
            userId: userId,
        })
            .populate('userId')
            .populate({
            path: 'data.lastBooking',
            populate: { path: 'property' },
        })
            .populate('data.lastViewProperties')
            .exec();
        return session;
    }
    async updateSession(session) {
        const { sessionId, data } = session;
        const existSession = await this.sessionSchema.findById(sessionId).exec();
        if (existSession && existSession.expires_at > new Date()) {
            return existSession.updateOne({
                last_activity: new Date(),
                data: data,
            });
        }
        else {
            throw new common_1.BadRequestException('Session does not exist or has expired');
        }
    }
    async updateLastPropertyView(userId, property) {
        return await this.sessionSchema.findOneAndUpdate({
            userId: userId,
        }, {
            $addToSet: { lastViewProperties: property },
        }, { new: true });
    }
    async deleteSession(session) {
        const { sessionId } = session;
        return this.sessionSchema.findByIdAndDelete(sessionId);
    }
    async refreshAccessToken(refreshToken) {
        const findSession = await this.sessionSchema.findOne({ refreshToken });
        try {
            await this.jwtService.verify(refreshToken, {
                secret: process.env.secret,
            });
            const findUser = await this.userSchema.findById(findSession.userId);
            const signInfo = {
                userName: findUser.userName,
                role: findUser.role,
            };
            return {
                _id: findUser._id,
                access_token: this.jwtService.sign({ signInfo }, { expiresIn: '1h', secret: process.env.secret }),
            };
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid Refresh Token or Refresh Token has expired');
        }
    }
    async signOut(userId) {
        return this.sessionSchema.findOneAndDelete({
            userId: userId,
        });
    }
    async getRecentSearch(userId) {
        const findSession = await this.sessionSchema.findOne({ userId: userId });
        return findSession.recent_search;
    }
    async getSessionHistory(userId) {
        const session = await this.sessionSchema.findOne({ userId });
        await session.populate('lastViewProperties');
        await session.populate('lastBooking');
        return {
            lastViewProperties: session.lastViewProperties,
            lastBookng: session.lastBooking,
            recent_search: session.recent_search,
        };
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        mongoose_2.Model])
], SessionService);
//# sourceMappingURL=session.service.js.map