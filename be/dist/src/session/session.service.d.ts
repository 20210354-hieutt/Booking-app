import { Session } from './session.schema';
import { Model, ObjectId } from 'mongoose';
import { CreateSessionDto } from './dto/createSession.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.schema';
export declare class SessionService {
    private readonly sessionSchema;
    private readonly jwtService;
    private readonly userSchema;
    constructor(sessionSchema: Model<Session>, jwtService: JwtService, userSchema: Model<User>);
    createSession(createSessionDto: CreateSessionDto): Promise<import("mongoose").Document<unknown, {}, Session> & Session & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getSession(id: any): Promise<import("mongoose").Document<unknown, {}, Session> & Session & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getSessionByUserId(userId: any): Promise<import("mongoose").Document<unknown, {}, Session> & Session & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    updateSession(session: any): Promise<Session>;
    updateLastPropertyView(userId: ObjectId, property: ObjectId): Promise<import("mongoose").Document<unknown, {}, Session> & Session & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    deleteSession(session: any): Promise<Session | void>;
    refreshAccessToken(refreshToken: string): Promise<{
        _id: import("mongoose").Types.ObjectId;
        access_token: string;
    }>;
    signOut(userId: ObjectId): Promise<import("mongoose").Document<unknown, {}, Session> & Session & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getRecentSearch(userId: ObjectId): Promise<{
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
    }[]>;
    getSessionHistory(userId: ObjectId): Promise<{
        lastViewProperties: import("../property/property.schema").Property[];
        lastBookng: import("../booking/booking.schema").Booking[];
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
    }>;
}
