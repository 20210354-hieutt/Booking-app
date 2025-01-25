import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from 'src/session/session.service';
export declare class ValidateTokenGuard implements CanActivate {
    private jwtService;
    private sessionService;
    constructor(jwtService: JwtService, sessionService: SessionService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
