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
exports.PropertySchema = exports.Property = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const user_schema_1 = require("../user/user.schema");
const type_enum_1 = require("./enum/type.enum");
let Property = class Property {
};
exports.Property = Property;
__decorate([
    (0, mongoose_1.Prop)({ require: true, type: mongoose_2.default.Schema.ObjectId, ref: 'User' }),
    __metadata("design:type", user_schema_1.User)
], Property.prototype, "owner_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Property.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Property.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            province: {
                type: String,
                require: true,
            },
            district: {
                type: String,
                require: true,
            },
            ward: {
                type: String,
                require: true,
            },
            street: {
                type: String,
                require: true,
            },
        },
        _id: false,
    }),
    __metadata("design:type", Object)
], Property.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            longitude: {
                type: Number,
                require: true,
            },
            latitude: {
                type: Number,
                require: true,
            },
        },
        _id: false,
    }),
    __metadata("design:type", Object)
], Property.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: type_enum_1.TYPE }),
    __metadata("design:type", String)
], Property.prototype, "property_type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: 0 }),
    __metadata("design:type", Number)
], Property.prototype, "rate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Property.prototype, "images", void 0);
exports.Property = Property = __decorate([
    (0, mongoose_1.Schema)()
], Property);
exports.PropertySchema = mongoose_1.SchemaFactory.createForClass(Property);
exports.PropertySchema.index({ location: '2dsphere' });
//# sourceMappingURL=property.schema.js.map