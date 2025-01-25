"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationMiddleware = void 0;
const common_1 = require("@nestjs/common");
let ValidationMiddleware = class ValidationMiddleware {
    async use(req, res, next) {
        const { userName, password } = req.body;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
        if (!userName) {
            throw new common_1.BadRequestException({
                message: ['Username and password are required'],
                field: ['userName'],
            });
        }
        if (!password) {
            throw new common_1.BadRequestException({
                message: ['Username and password are required'],
                field: ['password'],
            });
        }
        if (!userName && !password) {
            throw new common_1.BadRequestException({
                message: ['Username and password are required'],
                field: ['password', 'userName'],
            });
        }
        if (!passwordRegex.test(password)) {
            throw new common_1.BadRequestException({
                message: 'Invalid password. Please enter a password with at least 7 characters, including at least 1 uppercase letter, 1 number, and 1 special character.',
            });
        }
        next();
    }
};
exports.ValidationMiddleware = ValidationMiddleware;
exports.ValidationMiddleware = ValidationMiddleware = __decorate([
    (0, common_1.Injectable)()
], ValidationMiddleware);
//# sourceMappingURL=Authentication.middleware.js.map