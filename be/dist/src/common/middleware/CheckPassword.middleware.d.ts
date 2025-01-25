import { NestMiddleware } from '@nestjs/common';
export declare class CheckPasswordMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): Promise<void>;
}
