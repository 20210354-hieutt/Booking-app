"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const moment_1 = __importDefault(require("moment"));
const dotenv_1 = require("dotenv");
const qs_1 = __importDefault(require("qs"));
const crypto_1 = __importDefault(require("crypto"));
(0, dotenv_1.config)();
let PaymentController = class PaymentController {
    constructor(paymentSevice) {
        this.paymentSevice = paymentSevice;
    }
    async savePayment(body, req, res) {
        return this.paymentSevice.savePayment(body);
    }
    async createPayment(body, res) {
        try {
            const result = await this.paymentSevice.createPayment(body);
            return res.status(200).json(result);
        }
        catch (error) {
            console.log(error.message);
        }
    }
    async createPaymentUrl(body, req, res) {
        const date = new Date();
        const createDate = (0, moment_1.default)(date).format('YYYYMMDDHHmmss');
        const ipAddr = req.headers['x-forwarded-for']?.toString() ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket?.remoteAddress ||
            '';
        const tmnCode = process.env.VNP_TMN_CODE || '';
        const secretKey = process.env.VNP_HASH_SECRET || '';
        const vnpUrl = process.env.VNP_URL || '';
        const returnUrl = process.env.VNP_RETURN_URL || '';
        const orderId = (0, moment_1.default)(date).format('DDHHmmss');
        const amount = body.amount;
        const bankCode = body.bankCode;
        const locale = body.language || 'en';
        const currCode = 'VND';
        const vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Locale: locale,
            vnp_CurrCode: currCode,
            vnp_TxnRef: orderId,
            vnp_OrderInfo: `Thanh toan cho ma GD: ${orderId}`,
            vnp_OrderType: 'other',
            vnp_Amount: amount * 100,
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate,
        };
        if (bankCode) {
            vnp_Params['vnp_BankCode'] = bankCode;
        }
        const sortedParams = this.sortObject(vnp_Params);
        const signData = qs_1.default.stringify(sortedParams, { encode: false });
        const hmac = crypto_1.default.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        sortedParams['vnp_SecureHash'] = signed;
        const paymentUrl = `${vnpUrl}?${qs_1.default.stringify(sortedParams, { encode: false })}`;
        return res.status(200).json({ paymentUrl: paymentUrl });
    }
    async vnpayReturn(query, res) {
        const vnp_Params = { ...query };
        const secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        const sortedParams = this.sortObject(vnp_Params);
        const secretKey = process.env.VNP_HASH_SECRET || '';
        const signData = qs_1.default.stringify(sortedParams, { encode: false });
        const hmac = crypto_1.default.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        if (secureHash === signed) {
            return vnp_Params;
        }
        else {
            return vnp_Params;
        }
    }
    async vnpayIpn(query, res) {
        const vnp_Params = query;
        const secureHash = vnp_Params['vnp_SecureHash'];
        const rspCode = vnp_Params['vnp_ResponseCode'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        const sortedParams = this.sortObject(vnp_Params);
        const secretKey = process.env.VNP_HASH_SECRET || '';
        const signData = qs_1.default.stringify(sortedParams, { encode: false });
        const hmac = crypto_1.default.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        const paymentStatus = '0';
        const checkOrderId = true;
        const checkAmount = true;
        if (secureHash === signed) {
            if (checkOrderId) {
                if (checkAmount) {
                    if (paymentStatus === '0') {
                        if (rspCode === '00') {
                            res.status(200).json({ RspCode: '00', Message: 'Success' });
                        }
                        else {
                            res.status(200).json({ RspCode: '00', Message: 'Success' });
                        }
                    }
                    else {
                        res
                            .status(200)
                            .json({
                            RspCode: '02',
                            Message: 'This order has been updated to the payment status',
                        });
                    }
                }
                else {
                    res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
                }
            }
            else {
                res.status(200).json({ RspCode: '01', Message: 'Order not found' });
            }
        }
        else {
            res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
        }
    }
    sortObject(obj) {
        const sorted = {};
        const str = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (const key of str) {
            sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
        }
        return sorted;
    }
    async getAllPayment() {
        return this.paymentSevice.getAllPayment;
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('save_payment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "savePayment", null);
__decorate([
    (0, common_1.Post)('create_payment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Post)('create_transaction'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPaymentUrl", null);
__decorate([
    (0, common_1.Get)('vnpay_return'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "vnpayReturn", null);
__decorate([
    (0, common_1.Get)('vnpay_ipn'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "vnpayIpn", null);
__decorate([
    (0, common_1.Get)('/getAllPayment'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getAllPayment", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map