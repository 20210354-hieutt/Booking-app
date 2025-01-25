import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { PropertyService } from './property.service';
import { ObjectId } from 'mongoose';
import { ValidateTokenGuard } from 'src/common/guards/validateToken.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ROLE } from 'src/user/enum/role.enum';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import multer, { diskStorage } from 'multer';
import * as path from 'path';
import { log } from 'console';
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}
  @Post('/createPropertyWithPartner')
  @UseGuards(ValidateTokenGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async createPropertyWithPartner(
    @Body() data: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(files);
    const propertyImage = files.filter(
      (file, idx) => file.fieldname === `image[${idx}]`,
    );
    const roomImages = files.filter((file) =>
      file.fieldname.startsWith('rooms'),
    );
    if (propertyImage.length !== 0) {
      const propertyData = {
        ...data,
        image: propertyImage.map((image) => image.path),
        address: JSON.parse(data.address),
        location: JSON.parse(data.location),
        rooms:
          typeof data.rooms === 'string' ? JSON.parse(data.rooms) : data.rooms,
      };
      if (propertyData.rooms) {
        propertyData.rooms = propertyData.rooms.map((room, index) => {
          const imagesForRoom = roomImages
            .filter(
              (file, idx) => file.fieldname === `rooms[${index}]image[${idx}]`,
            )
            .map((file) => ({
              path: file.path,
              fieldname: file.fieldname,
            }));

          return {
            ...room,
            image: imagesForRoom,
          };
        });
        return this.propertyService.createNewProperty(propertyData);
      } else {
        propertyData.rooms = [];
        return this.propertyService.createNewProperty(propertyData);
      }
    } else {
      const propertyData = {
        ...data,
        address: JSON.parse(data.address),
        location: JSON.parse(data.location),
        rooms:
          typeof data.rooms === 'string' ? JSON.parse(data.rooms) : data.rooms,
      };
      return this.propertyService.createNewProperty(propertyData);
    }
  }
  @Post('/updatePropertyWithPartner')
  @UseGuards(ValidateTokenGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async updatePropertyWithPartner(
    @Body() data: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(files);
    const propertyImage = files.filter(
      (file, idx) => file.fieldname === `image[${idx}]`,
    );

    const roomImages = files.filter((file) =>
      file.fieldname.startsWith('rooms'),
    );

    if (propertyImage.length !== 0) {
      const propertyData = {
        ...data,
        image: propertyImage.map((image) => image.path),
        address: JSON.parse(data.address),
        location: JSON.parse(data.location),
        rooms:
          typeof data.rooms === 'string' ? JSON.parse(data.rooms) : data.rooms,
      };
      propertyData.rooms = propertyData.rooms.map((room, index) => {
        const imagesForRoom = roomImages
          .filter(
            (file, idx) => file.fieldname === `rooms[${index}]image[${idx}]`,
          )
          .map((file) => ({
            path: file.path,
            fieldname: file.fieldname,
          }));

        return {
          ...room,
          image: imagesForRoom, // Gắn mảng ảnh vào room
        };
      });

      return this.propertyService.updateProperty(propertyData);
    } else {
      const propertyData = {
        ...data,
        address: JSON.parse(data.address),
        location: JSON.parse(data.location),
        rooms:
          typeof data.rooms === 'string' ? JSON.parse(data.rooms) : data.rooms,
      };
      return this.propertyService.updateProperty(propertyData);
    }
  }
  @Get('/getAllProperty')
  async getAllProperty() {
    return this.propertyService.getAllProperty();
  }
  @Get('/getPropetyWithOwner/:id')
  async getPropetyWithOwner(
    @Param('id') id: ObjectId,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.propertyService.getPropertyWithOwner(id, page, limit);
  }
  @Get('/getPropertyById/:id')
  async getPropertyById(@Param('id') id: string) {
    return this.propertyService.getPropertyById(id);
  }
  @Get('getPropertiesSortedByRate')
  async getPropertiesSortedByRate() {
    return this.propertyService.getPropertiesSortedByRate();
  }
  @Post('getPropertyTypesByPlace')
  async getPropertyTypesByPlace(@Body() place: any) {
    return this.propertyService.getPropertyTypesByPlace(place.place);
  }
  @Post('getPropertyByTypeAndPlace')
  async getPropertyByTypeAndPlace(@Body() data: any) {
    return this.propertyService.getPropertyByTypeAndPlace(
      data.place,
      data.type,
    );
  }
  @Get('getAllTypeOfProperties')
  async getAllTypeOfProperties() {
    return this.propertyService.getAllTypeOfProperties();
  }
  @Post('getPropertyNear')
  async getPropertyNear(@Body() data: any) {
    return this.propertyService.getPropertyNear(data.longitude, data.latitude);
  }
  @UseGuards(RolesGuard, ValidateTokenGuard)
  @Roles(ROLE.PARTNER, ROLE.ADMIN)
  @Put('updateImageForProperty')
  async updateImageForProperty(@Body() data: any) {
    return this.propertyService.updateImageForProperty(
      data.propertyId,
      data.image,
    );
  }
  @Post('getPropertyByPlace')
  async getPropertyByPlace(@Body() data: any) {
    return this.propertyService.getPropertyByPlace(data.place);
  }
  @Get('getDistinctPlace')
  async getDistinctPlace() {
    return this.propertyService.getDistinctPlace();
  }
  @Get('getRateOfProperties')
  async getRateOfProperties() {
    return this.propertyService.getRateOfProperties();
  }
  @Post('deletePropertyById/:id')
  async deletePropertyById(
    @Param('id') id: string,
    @Body() data: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.propertyService.deletePropertyById(
      id,
      data.userId,
      page,
      limit,
    );
  }
  @Post('getPropertyAndPriceByDistance')
  async getPropertyAndPriceByDistance(
    @Query('distance') distance: number,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Body() data: any,
  ) {
    return this.propertyService.getPropertyAndPriceByDistance(
      longitude,
      latitude,
      data.check_in,
      data.check_out,
      distance,
    );
  }
}
