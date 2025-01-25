import { PropertyService } from './property.service';
import { ObjectId } from 'mongoose';
export declare class PropertyController {
    private readonly propertyService;
    constructor(propertyService: PropertyService);
    createPropertyWithPartner(data: any, files: Express.Multer.File[]): Promise<import("mongoose").Document<unknown, {}, import("./property.schema").Property> & import("./property.schema").Property & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    updatePropertyWithPartner(data: any, files: Express.Multer.File[]): Promise<import("mongoose").Document<unknown, {}, import("./property.schema").Property> & import("./property.schema").Property & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getAllProperty(): Promise<(import("mongoose").Document<unknown, {}, import("./property.schema").Property> & import("./property.schema").Property & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getPropetyWithOwner(id: ObjectId, page?: number, limit?: number): Promise<{
        properties: any[];
        totalPages: number;
        currentPage: number;
    }>;
    getPropertyById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./property.schema").Property> & import("./property.schema").Property & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getPropertiesSortedByRate(): Promise<any[]>;
    getPropertyTypesByPlace(place: any): Promise<import("./enum/type.enum").TYPE[]>;
    getPropertyByTypeAndPlace(data: any): Promise<(import("mongoose").Document<unknown, {}, import("./property.schema").Property> & import("./property.schema").Property & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getAllTypeOfProperties(): Promise<any[]>;
    getPropertyNear(data: any): Promise<any[]>;
    updateImageForProperty(data: any): Promise<import("mongoose").Document<unknown, {}, import("./property.schema").Property> & import("./property.schema").Property & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getPropertyByPlace(data: any): Promise<(import("mongoose").Document<unknown, {}, import("./property.schema").Property> & import("./property.schema").Property & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getDistinctPlace(): Promise<string[]>;
    getRateOfProperties(): Promise<{
        count: any;
        rate: number;
    }[]>;
    deletePropertyById(id: string, data: any, page?: number, limit?: number): Promise<{
        properties: any[];
        totalPages: number;
        currentPage: number;
    }>;
    getPropertyAndPriceByDistance(distance: number, longitude: number, latitude: number, data: any): Promise<any[]>;
}
