import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Date } from 'mongoose';

export class CreateUserDto {
  userName: string;

  password: string;
  address: {
    province: string;
    district: string;
    ward: string;
  };
  email: string;
  dob: Date;
  phoneNumber: string;
  uid: string;
}
