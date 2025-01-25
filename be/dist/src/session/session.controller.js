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
exports.SessionController = void 0;
const common_1 = require("@nestjs/common");
const session_service_1 = require("./session.service");
const createSession_dto_1 = require("./dto/createSession.dto");
let SessionController = class SessionController {
    constructor(sessionService) {
        this.sessionService = sessionService;
    }
    async create(createSessionDto) {
        return this.sessionService.createSession(createSessionDto);
    }
    async getSession(id) {
        return this.sessionService.getSession(id);
    }
    async updateLastProperties(session, id) {
        return this.sessionService.updateLastPropertyView(id, session.propertyId);
    }
    async deleteSession(session) {
        return this.sessionService.deleteSession(session);
    }
    async getSessionByUser(id) {
        return this.sessionService.getSessionByUserId(id);
    }
    async signOut(data, response) {
        response.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        await this.sessionService.signOut(data.userId);
        return response.status(common_1.HttpStatus.OK).json({
            message: 'Successfully signed out',
        });
    }
    async getRecentSearch(id) {
        return this.sessionService.getRecentSearch(id);
    }
    async getSessionHistory(id) {
        return this.sessionService.getSessionHistory(id);
    }
    async refreshAccessToken(request) {
        return this.sessionService.refreshAccessToken(request.cookies.refreshToken);
    }
};
exports.SessionController = SessionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createSession_dto_1.CreateSessionDto]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/getSession/:id'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getSession", null);
__decorate([
    (0, common_1.Put)('/updateLastProperties/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "updateLastProperties", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "deleteSession", null);
__decorate([
    (0, common_1.Get)('/getSessionByUser/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getSessionByUser", null);
__decorate([
    (0, common_1.Post)('/sign-out'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "signOut", null);
__decorate([
    (0, common_1.Get)('/getRecentSearch/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getRecentSearch", null);
__decorate([
    (0, common_1.Get)('/getSessionHistory/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getSessionHistory", null);
__decorate([
    (0, common_1.Get)('/refreshAccessToken'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "refreshAccessToken", null);
exports.SessionController = SessionController = __decorate([
    (0, common_1.Controller)('session'),
    __metadata("design:paramtypes", [session_service_1.SessionService])
], SessionController);
//# sourceMappingURL=session.controller.js.map