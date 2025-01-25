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
exports.RoomSchema = exports.Room = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const property_schema_1 = require("../property/property.schema");
let Room = class Room {
};
exports.Room = Room;
__decorate([
    (0, mongoose_1.Prop)({
        require: true,
        type: mongoose_2.default.Schema.ObjectId,
        ref: 'Property',
    }),
    __metadata("design:type", property_schema_1.Property)
], Room.prototype, "property_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Room.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Room.prototype, "size", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Room.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        _id: false,
        type: {
            weekday: Number,
            weekend: Number,
        },
    }),
    __metadata("design:type", Object)
], Room.prototype, "price_per_night", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        _id: false,
        type: {
            adults: {
                type: Number,
            },
            childs: {
                count: {
                    type: Number,
                },
                age: {
                    type: Number,
                },
            },
            room: {
                type: Number,
            },
        },
    }),
    __metadata("design:type", Object)
], Room.prototype, "capacity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Room.prototype, "facility", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Room.prototype, "rating", void 0);
exports.Room = Room = __decorate([
    (0, mongoose_1.Schema)()
], Room);
exports.RoomSchema = mongoose_1.SchemaFactory.createForClass(Room);
//# sourceMappingURL=room.schema.js.map