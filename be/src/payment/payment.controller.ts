import { Controller, Post, Body, Req, Res, Query, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import moment from 'moment';
import { config } from 'dotenv';
import qs from 'qs';
import crypto from 'crypto';

config(); // Load environment variables

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentSevice: PaymentService) {}
  @Post('save_payment')
  async savePayment(
    @Body() body: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.paymentSevice.savePayment(body);
  }

  @Post('create_payment')
  async createPayment(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.paymentSevice.createPayment(body);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error.message);
    }
  }

  @Post('create_transaction')
  async createPaymentUrl(
    @Body() body: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');

    const ipAddr =
      req.headers['x-forwarded-for']?.toString() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection as any).socket?.remoteAddress ||
      '';

    const tmnCode = process.env.VNP_TMN_CODE || '';
    const secretKey = process.env.VNP_HASH_SECRET || '';
    const vnpUrl = process.env.VNP_URL || '';
    const returnUrl = process.env.VNP_RETURN_URL || '';

    const orderId = moment(date).format('DDHHmmss');
    const amount = body.amount; // Lấy dữ liệu từ body
    const bankCode = body.bankCode;

    const locale = body.language || 'en';
    const currCode = 'VND';

    const vnp_Params: { [key: string]: string | number } = {
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

    // Sắp xếp tham số
    const sortedParams = this.sortObject(vnp_Params);

    // Tạo chữ ký
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    sortedParams['vnp_SecureHash'] = signed;

    const paymentUrl = `${vnpUrl}?${qs.stringify(sortedParams, { encode: false })}`;
    return res.status(200).json({ paymentUrl: paymentUrl });
  }

  @Get('vnpay_return')
  async vnpayReturn(@Query() query: any, @Res() res: Response) {
    const vnp_Params = { ...query };
    const secureHash = vnp_Params['vnp_SecureHash'];

    // Xóa các tham số không cần thiết
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp lại tham số
    const sortedParams = this.sortObject(vnp_Params);

    const secretKey = process.env.VNP_HASH_SECRET || '';

    // Tạo chữ ký
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      // Kiểm tra dữ liệu trong DB có hợp lệ hay không và thông báo kết quả

      return vnp_Params;
    } else {
      return vnp_Params;
    }
  }

  @Get('vnpay_ipn')
  async vnpayIpn(@Query() query: any, @Res() res: Response) {
    const vnp_Params = query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    const rspCode = vnp_Params['vnp_ResponseCode'];

    // Xóa SecureHash và SecureHashType khỏi tham số
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp các tham số
    const sortedParams = this.sortObject(vnp_Params);

    // Lấy secretKey từ biến môi trường
    const secretKey = process.env.VNP_HASH_SECRET || '';

    // Tạo chuỗi để ký
    const signData = qs.stringify(sortedParams, { encode: false });

    // Tạo chữ ký HMAC
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Giả sử đây là trạng thái của giao dịch
    const paymentStatus = '0'; // Trạng thái mặc định, giao dịch chưa được xử lý

    const checkOrderId = true;
    const checkAmount = true;
    if (secureHash === signed) {
      if (checkOrderId) {
        if (checkAmount) {
          if (paymentStatus === '0') {
            if (rspCode === '00') {
              res.status(200).json({ RspCode: '00', Message: 'Success' });
            } else {
              // Thanh toán thất bại
              // Cập nhật trạng thái thanh toán thất bại vào CSDL
              res.status(200).json({ RspCode: '00', Message: 'Success' });
            }
          } else {
            // eslint-disable-next-line prettier/prettier
            res
              .status(200)
              .json({
              RspCode: '02',
              Message: 'This order has been updated to the payment status',
            });
          }
        } else {
          res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
        }
      } else {
        res.status(200).json({ RspCode: '01', Message: 'Order not found' });
      }
    } else {
      res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }
  }

  // Hàm sắp xếp object
  private sortObject(obj: { [key: string]: any }): { [key: string]: string } {
    const sorted: { [key: string]: string } = {}; // Định nghĩa kiểu dữ liệu cho đối tượng kết quả
    const str: string[] = []; // Mảng chứa các khóa (keys)

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key)); // Thêm khóa đã mã hóa vào mảng
      }
    }

    str.sort(); // Sắp xếp các khóa

    for (const key of str) {
      // Thêm các cặp khóa-giá trị vào đối tượng sorted, giá trị được mã hóa và thay thế %20 bằng dấu cộng
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
    }

    return sorted; // Trả về đối tượng đã sắp xếp
  }
  @Get('/getAllPayment')
  async getAllPayment(){
    return this.paymentSevice.getAllPayment
  }
}
