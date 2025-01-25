import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../firebase-config';
import { SessionService } from 'src/session/session.service';
import admin from 'firebase-admin';
import { ROLE } from './enum/role.enum';
import { NotificationGateway } from 'src/notification/notification/notification.gateway';
import { NotificationService } from 'src/notification/notification.service';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userSchema: Model<User>,
    private jwtSerivce: JwtService,
    private sessionService: SessionService,
    private readonly notificationGateway: NotificationGateway,
    private readonly notificationService: NotificationService,
  ) { }
  async checkEmail(email: string) {
    const existEmail = await this.userSchema.findOne({ email: email });
    if (existEmail) {
      return existEmail;
    }
    return false;
  }
  async createUser(createUserDto: CreateUserDto) {
    const { userName, password, dob, email, address, phoneNumber } =
      createUserDto;

    const existedUser = await this.userSchema
      .findOne({
        userName: userName,
      })
      .exec();

    if (existedUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new this.userSchema({
      userName,
      password: hashedPassword,
      dob,
      email,
      address,
      phoneNumber,
    });
    return newUser.save();
  }
  async deleteUserById(userId: string) {
    return await this.userSchema.findByIdAndDelete(new Types.ObjectId(userId), {
      new: true,
    });
  }
  async updateUserById(userId: string, userDto: any) {
    return await this.userSchema.findByIdAndUpdate(
      new Types.ObjectId(userId),
      userDto,
      { new: true },
    );
  }
  async updatePassword(password: string, email: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await this.userSchema.findOneAndUpdate(
      {
        email: email,
      },
      {
        password: hashedPassword,
      },
    );
    return true;
  }
  async deleteUser(id: string) {
    const objectId = new Types.ObjectId(id);
    const existUser = await this.userSchema
      .findOne({
        _id: objectId,
      })
      .exec();
    if (!existUser) {
      throw new BadRequestException('Invalid ID');
    }
    return this.userSchema.deleteOne({
      _id: id,
    });
  }
  async findUser(userName: any) {
    const user = await this.userSchema
      .findOne({
        userName: userName.userName,
      })
      .exec();
    return user;
  }
  async signUp(createUserDto: CreateUserDto) {
    const { userName, password, dob, email, address, phoneNumber } =
      createUserDto;

    const exist = await this.userSchema
      .findOne({
        userName: userName,
      })
      .exec();

    if (exist) {
      throw new UnauthorizedException('Username already existed');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new this.userSchema({
      userName,
      password: hashedPassword,
      dob,
      email,
      address,
      phoneNumber,
    });
    return newUser.save();
  }

  async signIn(user: any) {
    const { userName, password } = user;

    console.log(userName, password);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(userName)) {
      console.log(11111);
      const existUser = await this.userSchema
        .findOne({
          userName: userName,
        })
        .select('+password')
        .exec();

      if (!existUser) {
        throw new UnauthorizedException('Invalid username or password');
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        existUser.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid username or password');
      }

      const newSession = await this.sessionService.createSession({
        userId: existUser._id.toString(),
        lastViewProperties: [],
        lastBooking: [],
        recent_search: [],
        uid: null,
      });

      const signInfo = { userName, role: existUser.role };

      return {
        access_token: this.jwtSerivce.sign({ signInfo }, { expiresIn: '1h' }),
        displayName: existUser.userName,
        _id: existUser._id,
        refreshToken: newSession.refreshToken,
      };
    }
    else {
      const existEmail = await this.userSchema.findOne({
        email: userName,
      });

      console.log(existEmail);

      if (!existEmail) {
        throw new UnauthorizedException('Invalid username or password');
      }
      console.log(1);

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          userName,
          password,
        );

        const signInfo = { userName, role: existEmail.role };

        await admin.auth().createCustomToken(userCredential.user.uid, {
          signInfo,
        });

        const jwtToken = this.jwtSerivce.sign(
          { uid: userCredential.user.uid, signInfo },
          { expiresIn: '1h' },
        );

        const newSession = await this.sessionService.createSession({
          userId: existEmail._id.toString(),
          uid: null,
          lastViewProperties: [],
          lastBooking: [],
          recent_search: [],
        });
        console.log(newSession);

        return {
          access_token: jwtToken,
          displayName: existEmail.userName,
          _id: existEmail._id,
          refreshToken: newSession.refreshToken,
        };
      } catch (err) {
        throw new BadRequestException({
          message: 'Wrong password!',
        });
      }
    }
  }
  async updateUser(user: any) {
    const { userName, dob, email, address, phoneNumber, role } = user;
    const isAdmin = role.some((idx) => idx == 'admin');

    const findUser = await this.userSchema.findOneAndUpdate(
      {
        userName: userName,
      },
      {
        $set: {
          userName,
          dob,
          email,
          address,
          phoneNumber,
          role,
          isAdmin: isAdmin,
        },
      },
      { new: true },
    );
    return findUser.save();
  }
  async signUpWithEmail(createUserDto: CreateUserDto) {
    try {
      const { userName, password, dob, email, address, phoneNumber } =
        createUserDto;
      const exist = await this.userSchema
        .findOne({
          email: email,
        })
        .exec();
      if (exist) {
        throw new BadRequestException('Email alread existed');
      }
      const existUserName = await this.userSchema.findOne({ userName });
      if (existUserName) {
        throw new BadRequestException('Username alread existed');
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const jwtToken = await this.jwtSerivce.sign({
        userName,
        password,
        dob,
        email,
        address,
        phoneNumber,
        uid: userCredential.user.uid,
      });

      await sendEmailVerification(userCredential.user);
      return { jwtToken };
    } catch (err) {
      throw err;
    }
  }
  async confirmSignUp(user: any) {
    const { userName, password, dob, email, address, phoneNumber, uid } = user;
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new this.userSchema({
      userName,
      dob,
      password: hashedPassword,
      email,
      address,
      phoneNumber,
      uid: uid,
    });
    const savedUser = await newUser.save();
    return savedUser;
  }
  async signInWithGoggle(user: any) {
    const { email, uid } = user;
    const findEmail = await this.userSchema.findOne({
      email: email,
    });

    if (findEmail) {
      const session = await this.sessionService.createSession({
        userId: findEmail._id.toString(),
        lastViewProperties: [],
        lastBooking: [],
        uid,
        recent_search: [],
      });
      const signInfo = { email, role: findEmail.role };

      await admin.auth().createCustomToken(uid, {
        signInfo,
      });

      const jwtToken = this.jwtSerivce.sign(
        { uid: uid, signInfo },
        { expiresIn: '1h' },
      );
      return {
        _id: findEmail._id,
        refreshToken: session.refreshToken,
        access_token: jwtToken,
      };
    } else {
      throw new BadRequestException('The email is not registered');
    }
  }
  async resetPassword(resetPassword: any) {
    const { email, password } = resetPassword;

    const findUser = await this.userSchema
      .findOne({
        email,
      })
      .select('+password')
      .exec();

    try {
      admin
        .auth()
        .updateUser(findUser.uid, {
          password: password,
        })
        .then(async (userRecord) => {
          console.log(
            'Successfully updated Firebase password for user:',
            userRecord.toJSON(),
          );

          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          await this.userSchema.findOneAndUpdate(
            {
              email: email,
            },
            {
              password: hashedPassword,
            },
          );
        });
    } catch (err) {
      throw err;
    }
  }
  async updatePartnerAccount(partner: any) {
    const findUser = await this.userSchema.findOneAndUpdate(
      { email: partner.email },
      {
        'partnerInfo.businessName': partner.businessName,
        'partnerInfo.propertyType': partner.propertyType,
        'partnerInfo.numberOfProperties': parseInt(partner.numberOfProperties),
        'partnerInfo.businessAddress.province': partner.province,
        'partnerInfo.businessAddress.district': partner.district,
        'partnerInfo.businessAddress.ward': partner.ward,
        'partnerInfo.businessAddress.street': partner.street,

        $addToSet: {
          role: ROLE.PARTNER,
        },
      },
      { new: true },
    );
    return findUser;
  }
  // async partnerRegistration(partner: any){

  // }
  // The registration will be sent to admin, create manage partner accounts in admin dashboard before create this function
  async updateInformationForGoogle(user: any) {
    const newUser = new this.userSchema(user);
    const savedUser = await newUser.save();
    const newSession = await this.sessionService.createSession({
      uid: user.uid,
      userId: savedUser._id.toString(),
      lastBooking: [],
      lastViewProperties: [],
      recent_search: [],
    });
    const signInfo = { userName: savedUser.email, role: savedUser.role };
    return {
      access_token: this.jwtSerivce.sign({ signInfo }, { expiresIn: '1h' }),
      _id: savedUser._id,
      refreshToken: newSession.refreshToken,
    };
  }
  async getPendingUser() {
    return this.userSchema.find({
      role: ROLE.PENDING,
    });
  }
  async requestToPartner(userId: string) {
    return this.userSchema.findByIdAndUpdate(
      new Types.ObjectId(userId),
      {
        $set: {
          role: ROLE.PENDING
        }
      },
      {
        new: true,
      },
    );
  }
  async checkRequestPartner(userId: string) {
    const findUser = await this.userSchema.findOne({
      _id: new Types.ObjectId(userId),
      role: ROLE.PENDING,
    });
    if (findUser) {
      return true;
    }
    return false;
  }
  async updateResetPasswordToken(userId: string, email: string) {
    const resetToken = await this.jwtSerivce.sign(
      { email, timestamp: Date.now() },
      { expiresIn: '1h' },
    );

    await this.userSchema.findByIdAndUpdate(
      new Types.ObjectId(userId),
      {
        $set: {
          resetPasswordExpires: Date.now() + 3600000,
          resetPasswordTokenStatus: 'unused',
          resetPasswordToken: resetToken,
        },
      },
      {
        new: true,
      },
    );
    return resetToken;
  }
  async checkResetPasswordToken(
    userId: string,
    newPassword: string,
    token: string,
  ) {
    try {
      const decoded = await this.jwtSerivce.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.userSchema.findOne({
        _id: new Types.ObjectId(userId),
        resetPasswordToken: token,
        resetPasswordTokenStatus: 'unused',
        resetPasswordExpires: { $gt: new Date() },
      });
      if (!user) {
        return {
          message: 'Token is invalid or has already been used',
        };
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await this.userSchema.findByIdAndUpdate(new Types.ObjectId(userId), {
        password: hashedPassword,
        resetPasswordTokenStatus: 'used',
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });

      return { message: true };
    } catch (err) {
      throw err;
    }
  }
  async updateRequestPartner(userId: string, status: ROLE) {
    if (status === ROLE.PARTNER) {
      console.log(userId);
      const message = 'Promote to Parter';
      const findUserId = await this.userSchema.findById(
        new Types.ObjectId(userId),
      );
      console.log(findUserId);
      await this.notificationService.createNotification({
        receiver_id: findUserId,
        type: 'Partner',
        message,
      });
      await this.notificationGateway.sendNotificationToUser(userId, message);
    }

    return await this.userSchema.findByIdAndUpdate(new Types.ObjectId(userId), {
      role: status,
    });
  }
  async getAllUser() {
    return await this.userSchema.find({});
  }
  async getPartner() {
    return await this.userSchema.find({
      role: ROLE.PARTNER,
    });
  }
  async getUserById(userId: string) {
    return await this.userSchema
      .findById(new Types.ObjectId(userId))
      .select('+password');
  }
}
