"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const role_enum_1 = require("../../user/enum/role.enum");
const roles_decorator_1 = require("../decorators/roles.decorator");
const jwt_1 = require("@nestjs/jwt");
const admin = __importStar(require("firebase-admin"));
const session_service_1 = require("../../session/session.service");
let RolesGuard = class RolesGuard {
    constructor(jwtService, reflector, sessionService) {
        this.jwtService = jwtService;
        this.reflector = reflector;
        this.sessionService = sessionService;
    }
    async canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('You must sign in');
        }
        let payload;
        try {
            payload = this.jwtService.verify(token);
        }
        catch (error) {
            console.log(error.name);
            if (error.name === 'TokenExpiredError') {
                throw new common_1.UnauthorizedException('You must sign in to perform this action');
            }
            else {
                payload = await admin.auth().verifyIdToken(token);
            }
        }
        request.user = payload;
        if (!payload.signInfo) {
            if (payload.uid) {
                return true;
            }
        }
        if (payload.signInfo.role === role_enum_1.ROLE.GUEST) {
            throw new common_1.UnauthorizedException('You must sign in to perform this action');
        }
        const hasRole = requiredRoles.some((role) => payload.signInfo.role
            .map((r) => r.toLowerCase())
            .includes(role.toLowerCase()));
        if (!hasRole) {
            console.log('User does not have the required role:', requiredRoles, 'User role:', payload.signInfo.role);
            throw new common_1.ForbiddenException('Insufficient permissions');
        }
        return true;
    }
    extractTokenFromHeader(request) {
        const authHeader = request.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
        }
        return null;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        core_1.Reflector,
        session_service_1.SessionService])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map