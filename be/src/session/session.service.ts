import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from './session.schema';
import { Model, ObjectId } from 'mongoose';
import { CreateSessionDto } from './dto/createSession.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.schema';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionSchema: Model<Session>,
    private readonly jwtService: JwtService,
    @InjectModel(User.name)
    private readonly userSchema: Model<User>,
  ) {}

  async createSession(createSessionDto: CreateSessionDto) {
    const { userId, lastViewProperties, lastBooking } = createSessionDto;

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const refreshToken = this.jwtService.sign(
      { userId: userId },
      { expiresIn: '7d' },
    );
    await this.sessionSchema.deleteMany({ userId });

    const newSession = new this.sessionSchema({
      userId: userId,
      lastViewProperties: lastViewProperties,
      lastBooking: lastBooking,
      expires_at: expiresAt,
      refreshToken,
      last_activity: Date.now(),
    });

    return newSession.save();
  }

  async getSession(id: any) {
    const { sessionId } = id;

    const session = await this.sessionSchema
      .findById(sessionId)
      .populate('userId')
      .exec();

    return session;
  }
  async getSessionByUserId(userId: any) {
    const session = await this.sessionSchema
      .findOne({
        userId: userId,
      })
      .populate('userId')
      .populate({
        path: 'data.lastBooking',
        populate: { path: 'property' },
      })
      .populate('data.lastViewProperties')

      .exec();
    return session;
  }
  async updateSession(session: any): Promise<Session> {
    const { sessionId, data } = session;
    const existSession = await this.sessionSchema.findById(sessionId).exec();

    if (existSession && existSession.expires_at > new Date()) {
      return existSession.updateOne({
        last_activity: new Date(),
        data: data,
      });
    } else {
      throw new BadRequestException('Session does not exist or has expired');
    }
  }
  async updateLastPropertyView(userId: ObjectId, property: ObjectId) {
    return await this.sessionSchema.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $addToSet: { lastViewProperties: property },
      },
      { new: true },
    );
  }
  async deleteSession(session: any): Promise<Session | void> {
    const { sessionId } = session;

    return this.sessionSchema.findByIdAndDelete(sessionId);
  }

  async refreshAccessToken(refreshToken: string) {
    const findSession = await this.sessionSchema.findOne({ refreshToken });
    try {
      await this.jwtService.verify(refreshToken, {
        secret: process.env.secret,
      });
      const findUser = await this.userSchema.findById(findSession.userId);
      const signInfo = {
        userName: findUser.userName,
        role: findUser.role,
      };
      return {
        _id: findUser._id,
        access_token: this.jwtService.sign(
          { signInfo },
          { expiresIn: '1h', secret: process.env.secret },
        ),
      };
    } catch (err) {
      throw new UnauthorizedException(
        'Invalid Refresh Token or Refresh Token has expired',
      );
    }
  }
  async signOut(userId: ObjectId) {
    return this.sessionSchema.findOneAndDelete({
      userId: userId,
    });
  }
  async getRecentSearch(userId: ObjectId) {
    const findSession = await this.sessionSchema.findOne({ userId: userId });
    return findSession.recent_search;
  }
  async getSessionHistory(userId: ObjectId) {
    const session = await this.sessionSchema.findOne({ userId });
    await session.populate('lastViewProperties');
    await session.populate('lastBooking');
    return {
      lastViewProperties: session.lastViewProperties,
      lastBookng: session.lastBooking,
      recent_search: session.recent_search,
    };
  }
}
