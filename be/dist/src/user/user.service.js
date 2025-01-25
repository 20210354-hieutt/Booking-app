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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./user.schema");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const auth_1 = require("firebase/auth");
const firebase_config_1 = require("../../firebase-config");
const session_service_1 = require("../session/session.service");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const role_enum_1 = require("./enum/role.enum");
const notification_gateway_1 = require("../notification/notification/notification.gateway");
const notification_service_1 = require("../notification/notification.service");
let UserService = class UserService {
    constructor(userSchema, jwtSerivce, sessionService, notificationGateway, notificationService) {
        this.userSchema = userSchema;
        this.jwtSerivce = jwtSerivce;
        this.sessionService = sessionService;
        this.notificationGateway = notificationGateway;
        this.notificationService = notificationService;
    }
    async checkEmail(email) {
        const existEmail = await this.userSchema.findOne({ email: email });
        if (existEmail) {
            return existEmail;
        }
        return false;
    }
    async createUser(createUserDto) {
        const { userName, password, dob, email, address, phoneNumber } = createUserDto;
        const existedUser = await this.userSchema
            .findOne({
            userName: userName,
        })
            .exec();
        if (existedUser) {
            throw new common_1.HttpException('User already exists', common_1.HttpStatus.CONFLICT);
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new this.userSchema({
            userName,
            password: hashedPassword,
            dob,
            email,
            address,
            phoneNumber,
        });
        return newUser.save();
    }
    async deleteUserById(userId) {
        return await this.userSchema.findByIdAndDelete(new mongoose_2.Types.ObjectId(userId), {
            new: true,
        });
    }
    async updateUserById(userId, userDto) {
        return await this.userSchema.findByIdAndUpdate(new mongoose_2.Types.ObjectId(userId), userDto, { new: true });
    }
    async updatePassword(password, email) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await this.userSchema.findOneAndUpdate({
            email: email,
        }, {
            password: hashedPassword,
        });
        return true;
    }
    async deleteUser(id) {
        const objectId = new mongoose_2.Types.ObjectId(id);
        const existUser = await this.userSchema
            .findOne({
            _id: objectId,
        })
            .exec();
        if (!existUser) {
            throw new common_1.BadRequestException('Invalid ID');
        }
        return this.userSchema.deleteOne({
            _id: id,
        });
    }
    async findUser(userName) {
        const user = await this.userSchema
            .findOne({
            userName: userName.userName,
        })
            .exec();
        return user;
    }
    async signUp(createUserDto) {
        const { userName, password, dob, email, address, phoneNumber } = createUserDto;
        const exist = await this.userSchema
            .findOne({
            userName: userName,
        })
            .exec();
        if (exist) {
            throw new common_1.UnauthorizedException('Username already existed');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new this.userSchema({
            userName,
            password: hashedPassword,
            dob,
            email,
            address,
            phoneNumber,
        });
        return newUser.save();
    }
    async signIn(user) {
        const { userName, password } = user;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(userName)) {
            const existUser = await this.userSchema
                .findOne({
                userName: userName,
            })
                .select('+password')
                .exec();
            if (!existUser) {
                throw new common_1.UnauthorizedException('Invalid username or password');
            }
            const isPasswordValid = await bcrypt.compare(password, existUser.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid username or password');
            }
            const newSession = await this.sessionService.createSession({
                userId: existUser._id.toString(),
                lastViewProperties: [],
                lastBooking: [],
                recent_search: [],
                uid: null,
            });
            const signInfo = { userName, role: existUser.role };
            return {
                access_token: this.jwtSerivce.sign({ signInfo }, { expiresIn: '1h' }),
                displayName: existUser.userName,
                _id: existUser._id,
                refreshToken: newSession.refreshToken,
            };
        }
        else {
            const existEmail = await this.userSchema.findOne({
                email: userName,
            });
            console.log(existEmail);
            if (!existEmail) {
                throw new common_1.UnauthorizedException('Invalid username or password');
            }
            console.log(1);
            try {
                const userCredential = await (0, auth_1.signInWithEmailAndPassword)(firebase_config_1.auth, userName, password);
                const signInfo = { userName, role: existEmail.role };
                await firebase_admin_1.default.auth().createCustomToken(userCredential.user.uid, {
                    signInfo,
                });
                const jwtToken = this.jwtSerivce.sign({ uid: userCredential.user.uid, signInfo }, { expiresIn: '1h' });
                const newSession = await this.sessionService.createSession({
                    userId: existEmail._id.toString(),
                    uid: null,
                    lastViewProperties: [],
                    lastBooking: [],
                    recent_search: [],
                });
                console.log(newSession);
                return {
                    access_token: jwtToken,
                    displayName: existEmail.userName,
                    _id: existEmail._id,
                    refreshToken: newSession.refreshToken,
                };
            }
            catch (err) {
                throw new common_1.BadRequestException({
                    message: 'Wrong password!',
                });
            }
        }
    }
    async updateUser(user) {
        const { userName, dob, email, address, phoneNumber, role } = user;
        const isAdmin = role.some((idx) => idx == 'admin');
        const findUser = await this.userSchema.findOneAndUpdate({
            userName: userName,
        }, {
            $set: {
                userName,
                dob,
                email,
                address,
                phoneNumber,
                role,
                isAdmin: isAdmin,
            },
        }, { new: true });
        return findUser.save();
    }
    async signUpWithEmail(createUserDto) {
        try {
            const { userName, password, dob, email, address, phoneNumber } = createUserDto;
            const exist = await this.userSchema
                .findOne({
                email: email,
            })
                .exec();
            if (exist) {
                throw new common_1.BadRequestException('Email alread existed');
            }
            const existUserName = await this.userSchema.findOne({ userName });
            if (existUserName) {
                throw new common_1.BadRequestException('Username alread existed');
            }
            const userCredential = await (0, auth_1.createUserWithEmailAndPassword)(firebase_config_1.auth, email, password);
            const jwtToken = await this.jwtSerivce.sign({
                userName,
                password,
                dob,
                email,
                address,
                phoneNumber,
                uid: userCredential.user.uid,
            });
            await (0, auth_1.sendEmailVerification)(userCredential.user);
            return { jwtToken };
        }
        catch (err) {
            throw err;
        }
    }
    async confirmSignUp(user) {
        const { userName, password, dob, email, address, phoneNumber, uid } = user;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new this.userSchema({
            userName,
            dob,
            password: hashedPassword,
            email,
            address,
            phoneNumber,
            uid: uid,
        });
        const savedUser = await newUser.save();
        return savedUser;
    }
    async signInWithGoggle(user) {
        const { email, uid } = user;
        const findEmail = await this.userSchema.findOne({
            email: email,
        });
        if (findEmail) {
            const session = await this.sessionService.createSession({
                userId: findEmail._id.toString(),
                lastViewProperties: [],
                lastBooking: [],
                uid,
                recent_search: [],
            });
            const signInfo = { email, role: findEmail.role };
            await firebase_admin_1.default.auth().createCustomToken(uid, {
                signInfo,
            });
            const jwtToken = this.jwtSerivce.sign({ uid: uid, signInfo }, { expiresIn: '1h' });
            return {
                _id: findEmail._id,
                refreshToken: session.refreshToken,
                access_token: jwtToken,
            };
        }
        else {
            throw new common_1.BadRequestException('The email is not registered');
        }
    }
    async resetPassword(resetPassword) {
        const { email, password } = resetPassword;
        const findUser = await this.userSchema
            .findOne({
            email,
        })
            .select('+password')
            .exec();
        try {
            firebase_admin_1.default
                .auth()
                .updateUser(findUser.uid, {
                password: password,
            })
                .then(async (userRecord) => {
                console.log('Successfully updated Firebase password for user:', userRecord.toJSON());
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                await this.userSchema.findOneAndUpdate({
                    email: email,
                }, {
                    password: hashedPassword,
                });
            });
        }
        catch (err) {
            throw err;
        }
    }
    async updatePartnerAccount(partner) {
        const findUser = await this.userSchema.findOneAndUpdate({ email: partner.email }, {
            'partnerInfo.businessName': partner.businessName,
            'partnerInfo.propertyType': partner.propertyType,
            'partnerInfo.numberOfProperties': parseInt(partner.numberOfProperties),
            'partnerInfo.businessAddress.province': partner.province,
            'partnerInfo.businessAddress.district': partner.district,
            'partnerInfo.businessAddress.ward': partner.ward,
            'partnerInfo.businessAddress.street': partner.street,
            $addToSet: {
                role: role_enum_1.ROLE.PARTNER,
            },
        }, { new: true });
        return findUser;
    }
    async updateInformationForGoogle(user) {
        const newUser = new this.userSchema(user);
        const savedUser = await newUser.save();
        const newSession = await this.sessionService.createSession({
            uid: user.uid,
            userId: savedUser._id.toString(),
            lastBooking: [],
            lastViewProperties: [],
            recent_search: [],
        });
        const signInfo = { userName: savedUser.email, role: savedUser.role };
        return {
            access_token: this.jwtSerivce.sign({ signInfo }, { expiresIn: '1h' }),
            _id: savedUser._id,
            refreshToken: newSession.refreshToken,
        };
    }
    async getPendingUser() {
        return this.userSchema.find({
            role: role_enum_1.ROLE.PENDING,
        });
    }
    async requestToPartner(userId) {
        return this.userSchema.findByIdAndUpdate(new mongoose_2.Types.ObjectId(userId), {
            $set: {
                role: role_enum_1.ROLE.PENDING
            }
        }, {
            new: true,
        });
    }
    async checkRequestPartner(userId) {
        const findUser = await this.userSchema.findOne({
            _id: new mongoose_2.Types.ObjectId(userId),
            role: role_enum_1.ROLE.PENDING,
        });
        if (findUser) {
            return true;
        }
        return false;
    }
    async updateResetPasswordToken(userId, email) {
        const resetToken = await this.jwtSerivce.sign({ email, timestamp: Date.now() }, { expiresIn: '1h' });
        await this.userSchema.findByIdAndUpdate(new mongoose_2.Types.ObjectId(userId), {
            $set: {
                resetPasswordExpires: Date.now() + 3600000,
                resetPasswordTokenStatus: 'unused',
                resetPasswordToken: resetToken,
            },
        }, {
            new: true,
        });
        return resetToken;
    }
    async checkResetPasswordToken(userId, newPassword, token) {
        try {
            const decoded = await this.jwtSerivce.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            const user = await this.userSchema.findOne({
                _id: new mongoose_2.Types.ObjectId(userId),
                resetPasswordToken: token,
                resetPasswordTokenStatus: 'unused',
                resetPasswordExpires: { $gt: new Date() },
            });
            if (!user) {
                return {
                    message: 'Token is invalid or has already been used',
                };
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            await this.userSchema.findByIdAndUpdate(new mongoose_2.Types.ObjectId(userId), {
                password: hashedPassword,
                resetPasswordTokenStatus: 'used',
                resetPasswordToken: null,
                resetPasswordExpires: null,
            });
            return { message: true };
        }
        catch (err) {
            throw err;
        }
    }
    async updateRequestPartner(userId, status) {
        if (status === role_enum_1.ROLE.PARTNER) {
            console.log(userId);
            const message = 'Promote to Parter';
            const findUserId = await this.userSchema.findById(new mongoose_2.Types.ObjectId(userId));
            console.log(findUserId);
            await this.notificationService.createNotification({
                receiver_id: findUserId,
                type: 'Partner',
                message,
            });
            await this.notificationGateway.sendNotificationToUser(userId, message);
        }
        return await this.userSchema.findByIdAndUpdate(new mongoose_2.Types.ObjectId(userId), {
            role: status,
        });
    }
    async getAllUser() {
        return await this.userSchema.find({});
    }
    async getPartner() {
        return await this.userSchema.find({
            role: role_enum_1.ROLE.PARTNER,
        });
    }
    async getUserById(userId) {
        return await this.userSchema
            .findById(new mongoose_2.Types.ObjectId(userId))
            .select('+password');
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        session_service_1.SessionService,
        notification_gateway_1.NotificationGateway,
        notification_service_1.NotificationService])
], UserService);
//# sourceMappingURL=user.service.js.map