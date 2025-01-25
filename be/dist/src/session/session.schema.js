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
exports.SessionSchema = exports.Session = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const user_schema_1 = require("../user/user.schema");
let Session = class Session {
};
exports.Session = Session;
__decorate([
    (0, mongoose_1.Prop)({
        unique: true,
        type: mongoose_2.default.Schema.ObjectId,
        ref: 'User',
    }),
    __metadata("design:type", user_schema_1.User)
], Session.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [mongoose_2.default.Schema.Types.ObjectId],
        ref: 'Property',
    }),
    __metadata("design:type", Array)
], Session.prototype, "lastViewProperties", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [mongoose_2.default.Schema.Types.ObjectId],
        ref: 'Booking',
    }),
    __metadata("design:type", Array)
], Session.prototype, "lastBooking", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                province: {
                    type: String,
                },
                check_in: {
                    type: Date,
                },
                check_out: {
                    type: Date,
                },
                capacity: {
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
            },
        ],
        _id: false,
    }),
    __metadata("design:type", Array)
], Session.prototype, "recent_search", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], Session.prototype, "uid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now() }),
    __metadata("design:type", Date)
], Session.prototype, "last_activity", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
        index: { expireAfterSeconds: 0 },
    }),
    __metadata("design:type", Date)
], Session.prototype, "expires_at", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Session.prototype, "refreshToken", void 0);
exports.Session = Session = __decorate([
    (0, mongoose_1.Schema)()
], Session);
const SessionSchema = mongoose_1.SchemaFactory.createForClass(Session);
exports.SessionSchema = SessionSchema;
SessionSchema.pre('save', function (next) {
    if (this.lastViewProperties.length > 4) {
        this.lastViewProperties = this.lastViewProperties.slice(-4);
    }
    if (this.recent_search.length > 3) {
        this.recent_search = this.recent_search.slice(-3);
    }
    next();
});
//# sourceMappingURL=session.schema.js.map