import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import { Reflector } from '@nestjs/core';
import { ROLE } from 'src/user/enum/role.enum';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log(request.body);

    // Throw error if no token is found
    if (!token) {
      request.user = {
        signInfo: {
          role: [ROLE.GUEST],
        },
      };
    }

    // Extract userName from request body
    const { userName, firstName, lastName } = request.body;

    // Validate if userName exists in the request
    if (!userName && !firstName && !lastName) {
      throw new UnauthorizedException('Missing userName');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailRegex.test(userName)) {
      // If userName is an email, verify Firebase token
      try {
        const firebasePayload = await admin.auth().verifyIdToken(token);

        if (firebasePayload.email === userName) {
          request.user = firebasePayload;
          return true;
        } else {
          throw new UnauthorizedException(
            'Firebase token does not match the userName',
          );
        }
      } catch (error) {
        throw new UnauthorizedException('Invalid Firebase token');
      }
    } else {
      // Otherwise, verify JWT token
      try {
        const jwtPayload = this.jwtService.verify(token);

        if (jwtPayload.userName === userName) {
          request.user = jwtPayload;
          return true;
        } else {
          throw new UnauthorizedException(
            'JWT token does not match the userName',
          );
        }
      } catch (error) {
        throw new UnauthorizedException('Invalid JWT token');
      }
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1]; // Extract the token
    }
    return null;
  }
}
