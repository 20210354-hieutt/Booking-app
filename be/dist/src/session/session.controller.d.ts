import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/createSession.dto';
import { Session } from './session.schema';
import { ObjectId } from 'mongoose';
import { Request, Response } from 'express';
export declare class SessionController {
    private readonly sessionService;
    constructor(sessionService: SessionService);
    create(createSessionDto: CreateSessionDto): Promise<Session>;
    getSession(id: any): Promise<Session | null>;
    updateLastProperties(session: any, id: ObjectId): Promise<import("mongoose").Document<unknown, {}, Session> & Session & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    deleteSession(session: any): Promise<void | Session>;
    getSessionByUser(id: string): Promise<import("mongoose").Document<unknown, {}, Session> & Session & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    signOut(data: any, response: Response): Promise<Response<any, Record<string, any>>>;
    getRecentSearch(id: ObjectId): Promise<{
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
    getSessionHistory(id: ObjectId): Promise<{
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
    refreshAccessToken(request: Request): Promise<{
        _id: import("mongoose").Types.ObjectId;
        access_token: string;
    }>;
}
