import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
export declare class PaymentController {
    private readonly paymentSevice;
    constructor(paymentSevice: PaymentService);
    savePayment(body: any, req: Request, res: Response): Promise<{
        message: string;
    }>;
    createPayment(body: any, res: Response): Promise<Response<any, Record<string, any>>>;
    createPaymentUrl(body: any, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    vnpayReturn(query: any, res: Response): Promise<any>;
    vnpayIpn(query: any, res: Response): Promise<void>;
    private sortObject;
    getAllPayment(): Promise<() => Promise<(import("mongoose").Document<unknown, {}, import("./payment.schema").Payment> & import("./payment.schema").Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>>;
}
