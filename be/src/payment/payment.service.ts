import { Injectable } from '@nestjs/common';

import { GmailService } from 'src/gmail/gmail.service';
import { PaymentModule } from './payment.module';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './payment.schema';
import { Booking } from 'src/booking/booking.schema';
@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
    private readonly gmailService: GmailService,
    @InjectModel(Booking.name)
    private readonly bookingSchema: Model<Booking>,
  ) {}

  async createPayment(data: any) {
    const payment = new this.paymentModel(data);
    payment.save();
    return { message: 'Thành công' };
  }

  async savePayment(data: any) {
    const firstname = data.firstname;
    const lastname = data.lastname;
    const transactionCode = data.transactionCode;
    const transactionTime = data.transactionTime;
    const price = data.price;
    const hotelName = data.hotelName;
    const address = data.address;
    const checkInDate = data.checkInDate;
    const checkOutDate = data.checkOutDate;
    const email = data.email;

    const subject = 'Thông báo giao dịch thành công';
    const text = `Kính gửi anh/chị ${firstname} ${lastname},

Chúng tôi vui mừng thông báo giao dịch thanh toán của anh/chị đã được xử lý thành công.

Thông tin giao dịch:
- Mã giao dịch: ${transactionCode}
- Thời gian thanh toán: ${transactionTime}
- Số tiền thanh toán: ${price} VND
- Phương thức thanh toán: Thẻ ATM - Tài khoản ngân hàng nội địa 

Thông tin đặt phòng:
- Khách sạn: ${hotelName}
- Địa chỉ: ${address}
- Nhận phòng: ${checkInDate}
- Trả phòng: ${checkOutDate}

Nếu anh/chị cần hỗ trợ, vui lòng liên hệ chúng tôi qua hotline: +84 123 456 789.

Cảm ơn anh/chị đã sử dụng dịch vụ của chúng tôi.

Trân trọng cảm ơn,
 Booking.com
`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 10px;
      background-color: #f9f9f9;
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #007bff;
    }
    .content {
      margin-bottom: 20px;
    }
    .content p {
      margin: 5px 0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888;
    }
    .button {
      display: inline-block;
      margin-top: 10px;
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    }
    .button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thông báo giao dịch thành công</h1>
    </div>
    <div class="content">
      <p>Kính gửi anh/chị <strong>${firstname} ${lastname}</strong>,</p>
      <p>Chúng tôi vui mừng thông báo giao dịch thanh toán của anh/chị đã được xử lý thành công.</p>
      <h2>Thông tin giao dịch:</h2>
      <p><strong>Mã giao dịch:</strong> ${transactionCode}</p>
      <p><strong>Thời gian thanh toán:</strong>${transactionTime}</p>
      <p><strong>Số tiền thanh toán:</strong> ${price} VND</p>
      <p><strong>Phương thức thanh toán:</strong> Thẻ ATM - Tài khoản ngân hàng nội địa</p>
      <h2>Thông tin đặt phòng:</h2>
      <p><strong>Khách sạn:</strong> ${hotelName}</p>
      <p><strong>Địa chỉ:</strong> ${address}</p>
      <p><strong>Nhận phòng:</strong> ${checkInDate}</p>
      <p><strong>Trả phòng:</strong> ${checkOutDate}</p>
      <p>Nếu anh/chị cần hỗ trợ, vui lòng liên hệ chúng tôi qua hotline: <strong>+84 123 456 789</strong>.</p>
    </div>
    <div class="footer">
      <p>Cảm ơn anh/chị đã sử dụng dịch vụ của chúng tôi.</p>
      <p>&copy; Booking.com</p>
    </div>
  </div>
</body>
</html>`;
    await this.gmailService.sendEmail(email, subject, text, html);
    return { message: 'Gửi email thành công' };
  }
  async getAllPayment(){
    return await this.paymentModel.find({}).populate('booking_id')
  }
}
