import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    const { userName, password } = req.body;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    if (!userName) {
      throw new BadRequestException({
        message: ['Username and password are required'],
        field: ['userName'],
      });
    }
    if (!password) {
      throw new BadRequestException({
        message: ['Username and password are required'],
        field: ['password'],
      });
    }
    if (!userName && !password) {
      throw new BadRequestException({
        message: ['Username and password are required'],
        field: ['password', 'userName'],
      });
    }
    if (!passwordRegex.test(password)) {
      throw new BadRequestException({
        message:
          'Invalid password. Please enter a password with at least 7 characters, including at least 1 uppercase letter, 1 number, and 1 special character.',
      });
    }
    next();
  }
}
