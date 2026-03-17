import { JewelleryType } from '../models/jewellery-type.model';

export interface PaginatedJewelleryTypes {
    jewellery_types: JewelleryType[];
    pagination: {
        totalCount: number;
        currentPage: number;
        totalPages: number;
    };
}

