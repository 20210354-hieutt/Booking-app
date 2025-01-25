import { NestMiddleware } from '@nestjs/common';
export declare class ResetPasswordMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): Promise<void>;
}
