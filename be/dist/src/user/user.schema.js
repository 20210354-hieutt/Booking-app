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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const role_enum_1 = require("./enum/role.enum");
let User = class User {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], User.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "uid", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: Date, default: null }),
    __metadata("design:type", Object)
], User.prototype, "resetPasswordExpires", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['unused', 'used'], default: 'unused' }),
    __metadata("design:type", String)
], User.prototype, "resetPasswordTokenStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            province: {
                type: String,
                require: false,
            },
            district: {
                type: String,
                require: false,
            },
            ward: {
                type: String,
                require: false,
            },
        },
        _id: false,
    }),
    __metadata("design:type", Object)
], User.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Object)
], User.prototype, "dob", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], enum: role_enum_1.ROLE, default: role_enum_1.ROLE.MEMBER }),
    __metadata("design:type", Array)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isAdmin", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            businessName: { type: String, required: false },
            propertyType: { type: String, required: false },
            numberOfProperties: { type: Number, required: false },
            businessAddress: {
                type: {
                    province: {
                        type: String,
                        require: false,
                    },
                    district: {
                        type: String,
                        require: false,
                    },
                    ward: {
                        type: String,
                        require: false,
                    },
                    street: {
                        type: String,
                        require: false,
                    },
                },
                _id: false,
            },
        },
        _id: false,
    }),
    __metadata("design:type", Object)
], User.prototype, "partnerInfo", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)()
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=user.schema.js.map