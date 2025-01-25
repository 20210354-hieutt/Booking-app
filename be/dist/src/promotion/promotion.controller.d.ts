import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/createPromotion.dto';
export declare class PromotionController {
    private readonly promotionService;
    constructor(promotionService: PromotionService);
    createPromotion(createPromotionDto: CreatePromotionDto): Promise<import("mongoose").Document<unknown, {}, import("./promotion.schema").Promotion> & import("./promotion.schema").Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getAllPromotion(): Promise<(import("mongoose").Document<unknown, {}, import("./promotion.schema").Promotion> & import("./promotion.schema").Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
}
