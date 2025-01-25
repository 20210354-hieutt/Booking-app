import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/createSession.dto';
import { Session } from './session.schema';
import { ObjectId } from 'mongoose';
import { Request, Response } from 'express';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}
  @Post()
  async create(@Body() createSessionDto: CreateSessionDto): Promise<Session> {
    return this.sessionService.createSession(createSessionDto);
  }
  @Get('/getSession/:id')
  async getSession(@Body() id: any): Promise<Session | null> {
    return this.sessionService.getSession(id);
  }

  @Put('/updateLastProperties/:id')
  async updateLastProperties(@Body() session: any, @Param('id') id: ObjectId) {
    return this.sessionService.updateLastPropertyView(id, session.propertyId);
  }
  @Delete(':id')
  async deleteSession(@Body() session: any) {
    return this.sessionService.deleteSession(session);
  }
  @Get('/getSessionByUser/:id')
  async getSessionByUser(@Param('id') id: string) {
    return this.sessionService.getSessionByUserId(id);
  }
  @Post('/sign-out')
  async signOut(@Body() data: any, @Res() response: Response) {
    response.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    await this.sessionService.signOut(data.userId);
    return response.status(HttpStatus.OK).json({
      message: 'Successfully signed out',
    });
  }
  @Get('/getRecentSearch/:id')
  async getRecentSearch(@Param('id') id: ObjectId) {
    return this.sessionService.getRecentSearch(id);
  }
  @Get('/getSessionHistory/:id')
  async getSessionHistory(@Param('id') id: ObjectId) {
    return this.sessionService.getSessionHistory(id);
  }
  @Get('/refreshAccessToken')
  async refreshAccessToken(@Req() request: Request) {
    return this.sessionService.refreshAccessToken(request.cookies.refreshToken);
  }
}
