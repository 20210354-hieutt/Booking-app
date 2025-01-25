"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordMiddleware = void 0;
const common_1 = require("@nestjs/common");
let ResetPasswordMiddleware = class ResetPasswordMiddleware {
    async use(req, res, next) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
        const requiredFields = [
            { message: 'Email is required', field: 'email' },
            { message: 'Password is required', field: 'password' },
            { message: 'Please re-enter the password', field: 'rePassword' },
        ];
        console.log(req.body);
        const errors = requiredFields
            .filter(({ field }) => !req.body[field])
            .map(({ field, message }) => ({
            field,
            message,
        }));
        if (!passwordRegex.test(req.body.password)) {
            throw new common_1.BadRequestException({
                message: 'Invalid password. Please enter a password with at least 7 characters, including at least 1 uppercase letter, 1 number, and 1 special character.',
            });
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException({
                message: errors.map((error) => error.message),
                field: errors.map((error) => error.field),
            });
        }
        else {
            if (req.body.password !== req.body.rePassword) {
                throw new common_1.BadRequestException({
                    message: 'The password is not the same',
                });
            }
        }
        next();
    }
};
exports.ResetPasswordMiddleware = ResetPasswordMiddleware;
exports.ResetPasswordMiddleware = ResetPasswordMiddleware = __decorate([
    (0, common_1.Injectable)()
], ResetPasswordMiddleware);
//# sourceMappingURL=ResetPassword.middleware.js.map