import { Type } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class CreateSessionDto {
  userId: string;
  uid: string;
  lastViewProperties: ObjectId[];
  lastBooking: ObjectId[];
  recent_search: {
    province: string;
    check_in: Date;
    check_out: Date;
    capacity: {
      adults: number;
      childs: {
        age: number;
        count: number;
      };
    };
  }[];
}
