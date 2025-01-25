import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from 'src/session/session.service';
export declare class RolesGuard implements CanActivate {
    private readonly jwtService;
    private readonly reflector;
    private readonly sessionService;
    constructor(jwtService: JwtService, reflector: Reflector, sessionService: SessionService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
