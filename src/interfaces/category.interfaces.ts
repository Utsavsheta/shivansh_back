import { Category } from '../models/category.model';

export interface PaginatedCategories {
    categories: Category[];
    pagination: {
        totalCount: number;
        currentPage: number;
        totalPages: number;
    };
}

export interface CreateCategoryData {
    category_name: string;
    status?: 'ACTIVE' | 'INACTIVE';
    category_image_url?: string | null;
    slug?: string;
}

export interface UpdateCategoryData {
    category_name?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    category_image_url?: string | null;
    slug?: string;
}

