import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { Response } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(createUserDto: CreateUserDto): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    deleteUserById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    updateUserById(id: string, data: any): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    signUp(createUserDto: CreateUserDto): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    signUpWithEmail(signup: any): Promise<{
        jwtToken: string;
    }>;
    confirmSignUpWithEmail(signup: any): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    signIn(user: any, response: Response): Promise<Response<any, Record<string, any>>>;
    checkEmail(email: any): Promise<false | (import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })>;
    updatePassword(password: any): Promise<boolean>;
    signInWithEmail(user: any, response: Response): Promise<Response<any, Record<string, any>>>;
    updateUser(user: any): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    resetPassword(resetPassword: any): Promise<void>;
    updatePartnerAccount(partner: any): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    updateInformationForGoogle(user: any, response: Response): Promise<Response<any, Record<string, any>>>;
    getPendingUser(): Promise<(import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    requestTopartner(id: string): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    checkRequest(id: string): Promise<boolean>;
    updateResetPasswordToken(userId: string, email: string): Promise<string>;
    checkResetPasswordToken(userId: string, token: string, user: any): Promise<{
        message: string;
    } | {
        message: boolean;
    }>;
    updateRequestPartner(data: any): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getAllUser(): Promise<(import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getUserById(userId: string): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getPartner(): Promise<(import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
}
