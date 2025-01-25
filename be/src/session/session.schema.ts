import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { Booking } from 'src/booking/booking.schema';
import { Property } from 'src/property/property.schema';
import { User } from 'src/user/user.schema';

@Schema()
export class Session {
  @Prop({
    unique: true,
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  })
  userId: User;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Property',
  })
  lastViewProperties: Property[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Booking',
  })
  lastBooking: Booking[];
  @Prop({
    type: [
      {
        province: {
          type: String,
        },
        check_in: {
          type: Date,
        },
        check_out: {
          type: Date,
        },
        capacity: {
          adults: {
            type: Number,
          },
          childs: {
            count: {
              type: Number,
            },
            age: {
              type: Number,
            },
          },
          room: {
            type: Number,
          },
        },
      },
    ],
    _id: false,
  })
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
      room: number;
    };
  }[];
  @Prop({})
  uid: string;
  @Prop({ type: Date, default: Date.now() })
  last_activity: Date;
  @Prop({
    type: Date,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
    index: { expireAfterSeconds: 0 },
  })
  expires_at: Date;
  @Prop({ required: true })
  refreshToken: string;
}
const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.pre('save', function (next) {
  if (this.lastViewProperties.length > 4) {
    this.lastViewProperties = this.lastViewProperties.slice(-4);
  }

  if (this.recent_search.length > 3) {
    this.recent_search = this.recent_search.slice(-3);
  }

  next();
});

export { SessionSchema };
