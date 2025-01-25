import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

@Injectable()
export class CreateUserMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
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
      throw new BadRequestException({
        message: errors.map((error) => error.message),
        field: errors.map((error) => error.field),
      });
    }
    next();
  }
}
