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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewSchema = exports.Review = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const user_schema_1 = require("../user/user.schema");
const type_enum_1 = require("./enum/type.enum");
const room_schema_1 = require("../room/room.schema");
let Review = class Review {
};
exports.Review = Review;
__decorate([
    (0, mongoose_1.Prop)({ require: true, type: mongoose_2.default.Schema.ObjectId, ref: 'User' }),
    __metadata("design:type", user_schema_1.User)
], Review.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ require: true, type: mongoose_2.default.Schema.ObjectId, ref: 'Room' }),
    __metadata("design:type", room_schema_1.Room)
], Review.prototype, "roomId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Review.prototype, "review_text", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: type_enum_1.TYPE }),
    __metadata("design:type", String)
], Review.prototype, "review_type", void 0);
exports.Review = Review = __decorate([
    (0, mongoose_1.Schema)()
], Review);
exports.ReviewSchema = mongoose_1.SchemaFactory.createForClass(Review);
//# sourceMappingURL=review.schema.js.map