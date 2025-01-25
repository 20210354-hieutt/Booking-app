import { Body, Controller, Get, Post } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/createPromotion.dto';

@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}
  @Post('/createPromotion')
  async createPromotion(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionService.createPromotion(createPromotionDto);
  }
  @Get('/getAllPromotion')
  async getAllPromotion() {
    return this.promotionService.getAllPromotion();
  }
}
