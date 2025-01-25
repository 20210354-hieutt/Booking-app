import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class ValidateTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const token = request.cookies.refreshToken;
    if (!token) {
      throw new UnauthorizedException('Sign In Required');
    }

    try {
      this.jwtService.verify(token, { secret: process.env.secret });

      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        const refreshToken = request.cookies['refreshToken'];
        if (!refreshToken) {
          throw new UnauthorizedException('Sign In Required');
        }

        const newAccessToken =
          await this.sessionService.refreshAccessToken(refreshToken);
        response.setHeader('authorization', `Bearer ${newAccessToken}`);

        return true;
      }
      
      throw new UnauthorizedException('Sign In Required');
    }
  }
}
