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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const createUser_dto_1 = require("./dto/createUser.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("./enum/role.enum");
const roles_guard_1 = require("../common/guards/roles.guard");
const validateToken_guard_1 = require("../common/guards/validateToken.guard");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async createUser(createUserDto) {
        return this.userService.createUser(createUserDto);
    }
    async deleteUserById(id) {
        return this.userService.deleteUserById(id);
    }
    async updateUserById(id, data) {
        return this.userService.updateUserById(id, data);
    }
    async signUp(createUserDto) {
        return this.userService.signUp(createUserDto);
    }
    async signUpWithEmail(signup) {
        console.log(signup);
        return this.userService.signUpWithEmail(signup);
    }
    async confirmSignUpWithEmail(signup) {
        return this.userService.confirmSignUp(signup);
    }
    async signIn(user, response) {
        const data = await this.userService.signIn(user);
        response.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return response.status(common_1.HttpStatus.OK).json({
            _id: data._id,
            accessToken: data.access_token,
            displayName: data.displayName,
            refreshToken: data.refreshToken,
            message: 'Login successful',
        });
    }
    async checkEmail(email) {
        return this.userService.checkEmail(email.data);
    }
    async updatePassword(password) {
        return this.userService.updatePassword(password.password, password.email);
    }
    async signInWithEmail(user, response) {
        const data = await this.userService.signInWithGoggle(user);
        response.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return response.status(common_1.HttpStatus.OK).json({
            _id: data._id,
            accessToken: data.access_token,
            message: 'Login successful',
        });
    }
    async updateUser(user) {
        return this.userService.updateUser(user);
    }
    async resetPassword(resetPassword) {
        return this.userService.resetPassword(resetPassword);
    }
    async updatePartnerAccount(partner) {
        return this.userService.updatePartnerAccount(partner.partner);
    }
    async updateInformationForGoogle(user, response) {
        const data = await this.userService.updateInformationForGoogle(user.user);
        response.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return response.status(common_1.HttpStatus.OK).json({
            _id: data._id,
            accessToken: data.access_token,
            refreshToken: data.refreshToken,
            message: 'Login successful',
        });
    }
    async getPendingUser() {
        return this.userService.getPendingUser();
    }
    async requestTopartner(id) {
        return this.userService.requestToPartner(id);
    }
    async checkRequest(id) {
        return this.userService.checkRequestPartner(id);
    }
    async updateResetPasswordToken(userId, email) {
        return this.userService.updateResetPasswordToken(userId, email);
    }
    async checkResetPasswordToken(userId, token, user) {
        return this.userService.checkResetPasswordToken(userId, user.password, token);
    }
    async updateRequestPartner(data) {
        return this.userService.updateRequestPartner(data.userId, data.status);
    }
    async getAllUser() {
        return this.userService.getAllUser();
    }
    async getUserById(userId) {
        return this.userService.getUserById(userId);
    }
    async getPartner() {
        return this.userService.getPartner();
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('/create-user'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUser_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Delete)('/deleteUserById/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUserById", null);
__decorate([
    (0, common_1.Put)('/updateUserById/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserById", null);
__decorate([
    (0, common_1.Post)('/sign-up'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUser_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('/sign-up-with-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signUpWithEmail", null);
__decorate([
    (0, common_1.Post)('/confirm-signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "confirmSignUpWithEmail", null);
__decorate([
    (0, common_1.Post)('/sign-in'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signIn", null);
__decorate([
    (0, common_1.Post)('/check-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkEmail", null);
__decorate([
    (0, common_1.Post)('update-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Post)('/sign-in-with-google'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signInWithEmail", null);
__decorate([
    (0, common_1.Post)('/update-user'),
    (0, roles_decorator_1.Roles)(role_enum_1.ROLE.ADMIN, role_enum_1.ROLE.MEMBER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('updatePartnerAccount'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePartnerAccount", null);
__decorate([
    (0, common_1.Post)('updateInformationForGoogle'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateInformationForGoogle", null);
__decorate([
    (0, common_1.Get)('getPendingUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPendingUser", null);
__decorate([
    (0, common_1.Get)('requestToPartner/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "requestTopartner", null);
__decorate([
    (0, common_1.Get)('checkRequest/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkRequest", null);
__decorate([
    (0, common_1.Get)('updateResetPasswordToken'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateResetPasswordToken", null);
__decorate([
    (0, common_1.Post)('checkResetPasswordToken'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('token')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkResetPasswordToken", null);
__decorate([
    (0, common_1.Put)('updateRequestPartner'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateRequestPartner", null);
__decorate([
    (0, common_1.Get)('getAllUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUser", null);
__decorate([
    (0, common_1.Get)('getUserById/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.UseGuards)(validateToken_guard_1.ValidateTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.ROLE.ADMIN),
    (0, common_1.Get)('getPartner'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPartner", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map