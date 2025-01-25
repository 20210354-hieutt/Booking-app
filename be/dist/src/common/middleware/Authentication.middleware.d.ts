import { NestMiddleware } from '@nestjs/common';
export declare class ValidationMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): Promise<void>;
}
