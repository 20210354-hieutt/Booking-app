import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { FindRoomDto } from './dto/findRoom.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ROLE } from 'src/user/enum/role.enum';
import { ValidateTokenGuard } from 'src/common/guards/validateToken.guard';
import { ObjectId } from 'mongoose';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
  @UseGuards(RolesGuard, ValidateTokenGuard)
  @Roles(ROLE.PARTNER, ROLE.ADMIN)
  @Post('createRoom')
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.createRoom(createRoomDto);
  }
  @Post('getRoomWithProperty')
  async getRoomWithProperty(@Body() property_id: any) {
    return this.roomService.getRoomWithProperty(property_id.property_id);
  }
  @Post('findRoom')
  async findRoom(@Body() findRoomDto: FindRoomDto) {
    return this.roomService.findRoom(findRoomDto);
  }
  // @Post('findAvailableRoomForBooking')
  // async findAvailableRoomForBooking(@Body() data: any) {
  //   return this.roomService.findAvailableRoomForBooking(
  //     data.room_id,
  //     data.property_id,
  //     data.check_in,
  //     data.check_out,
  //     data.capacity,
  //   );
  // }
  @Post('findAvailableRoomWithSearch')
  async findAvailableRoomWithSearch(@Body() data: any) {
    return this.roomService.findAvailableRoomWithSearch(
      data.userId,
      data.place || data.province,
      data.check_in,
      data.check_out,
      data.capacity,
      data.type,
    );
  }
  @UseGuards(RolesGuard, ValidateTokenGuard)
  @Roles(ROLE.PARTNER, ROLE.ADMIN)
  @Put('updateImageForRoom')
  async updateImageForRoom(@Body() data: any) {
    return this.roomService.updateImageForRoom(data.roomId, data.image);
  }
  @Get('getMonthlyOccupancyRatesByOwner/:id')
  async getMonthlyOccupancyRatesByOwner(@Param('id') id: any) {
    return this.roomService.getMonthlyOccupancyRatesByOwner(id, 2024);
  }
  @Get('getMonthlyOccupancyRatesByProperty/:id')
  async getMonthlyOccupancyRatesByProperty(@Param('id') id: any) {
    return this.roomService.getMonthlyOccupancyRatesByProperty(id, 2024);
  }
  @Delete(`deleteRoomById/:id`)
  async deleteRoomById(@Param('id') id: ObjectId) {
    return this.roomService.deleteRoom(id);
  }
  @Post('getAllRoomWithTotalPrice')
  async getAllRoomWithTotalPrice(@Body() data: any) {
    return this.roomService.getAllRoomWithTotalPrice({
      check_in: data.check_in,
      check_out: data.check_out,
      place: data.place,
      userId: data.userId,
      capacity: data.capacity,
    });
  }
  @Get('getAllRoomWithDetails')
  async getAllRoomWithDetails() {
    return this.roomService.getAllRoomWithDetails();
  }
  @Post('getRoomWithPriceByProperty')
  async getRoomWithPriceByProperty(@Body() data: any) {
    return this.roomService.getRoomWithPriceByProperty(
      data.property_id,
      data.check_out,
      data.check_in,
    );
  }
  @Post('findRoomInReservation')
  async findRoomInReservation(@Body() data: any) {
    return this.roomService.findRoomInReservation(
      data.property_id,
      data.capacity,
      data.check_in_date,
      data.check_out_date,
    );
  }
  @Get('getRoomById/:roomId')
  async getRoomById(@Param('roomId') roomId: string) {
    return this.roomService.getRoomById(roomId);
  }
}
