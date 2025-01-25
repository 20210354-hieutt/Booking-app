import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/createReview.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ROLE } from 'src/user/enum/role.enum';
import { ObjectId } from 'mongoose';
import { ValidateTokenGuard } from 'src/common/guards/validateToken.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @UseGuards(ValidateTokenGuard, RolesGuard)
  @Roles(ROLE.MEMBER, ROLE.PARTNER)
  @Post('/createReview')
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(createReviewDto);
  }
  @Get('/findReviewWithProperty/:property_id')
  async findReviewWithProperty(
    @Param('property_id') property_id: string,
    @Query('page') page: number,
  ) {
    return this.reviewService.findReviewWithProperty(property_id, page);
  }
  @Get('getMonthlyRating/:id')
  async getMonthlyRating(@Param('id') id: any) {
    return this.reviewService.getMonthlyRating(id);
  }
  @Get('getMonthlyRatingByProperty/:id')
  async getMonthlyRatingByProperty(@Param('id') id: any) {
    return this.reviewService.getMonthlyRatingByProperty(id);
  }
  @Post('getReviewByRate/:property_id')
  async getReviewByRate(
    @Param('property_id') property_id: string,
    @Body() data: any,
    @Query('page') page: number,
  ) {
    return this.reviewService.getReviewByRate(
      property_id,
      data.min,
      data.max,
      page,
    );
  }
  @Post('getReviewByRateAndType/:property_id')
  async getReviewByType(
    @Param('property_id') property_id: string,
    @Body() data: any,
    @Query('page') page: number,
  ) {
    return this.reviewService.getReviewByRateAndType(
      property_id,
      data.review_type,
      data.min,
      data.max,
      page,
    );
  }
}
