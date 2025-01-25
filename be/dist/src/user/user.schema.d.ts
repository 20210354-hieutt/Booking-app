import { Date } from 'mongoose';
import { ROLE } from './enum/role.enum';
export declare class User {
    userName: string;
    password: string;
    phoneNumber: string;
    gender: boolean;
    uid: string;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    resetPasswordTokenStatus: 'unused' | 'used';
    address: {
        province: string;
        district: string;
        ward: string;
    };
    avatar: string;
    email: string;
    dob: Date;
    role: ROLE[];
    isAdmin: boolean;
    partnerInfo?: {
        businessName: string;
        propertyType: string;
        numberOfProperties: number;
        businessAddress: {
            province: string;
            district: string;
            ward: string;
            street: string;
        };
    };
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
