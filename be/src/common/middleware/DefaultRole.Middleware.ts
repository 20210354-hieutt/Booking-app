import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { ROLE } from 'src/user/enum/role.enum';

@Injectable()
export class DefaultRoleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // console.log(user);

    next();
  }
}
