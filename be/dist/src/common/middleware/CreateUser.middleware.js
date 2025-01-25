"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserMiddleware = void 0;
const common_1 = require("@nestjs/common");
let CreateUserMiddleware = class CreateUserMiddleware {
    async use(req, res, next) {
        const { email } = req.body;
        const requiredFields = [
            { message: 'Username is required', field: 'userName' },
            { message: 'Password is required', field: 'password' },
            { message: 'Date of birth is required', field: 'dob' },
            { message: 'Email is required', field: 'email' },
            { message: 'Address is required', field: 'address' },
            { message: 'Phone number is required', field: 'phoneNumber' },
        ];
        const errors = requiredFields
            .filter(({ field }) => !req.body[field])
            .map(({ field, message }) => ({ field, message }));
        if (email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                errors.push({ field: 'email', message: 'Invalid email format' });
            }
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException({
                message: errors.map((error) => error.message),
                field: errors.map((error) => error.field),
            });
        }
        next();
    }
};
exports.CreateUserMiddleware = CreateUserMiddleware;
exports.CreateUserMiddleware = CreateUserMiddleware = __decorate([
    (0, common_1.Injectable)()
], CreateUserMiddleware);
//# sourceMappingURL=CreateUser.middleware.js.map