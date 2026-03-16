import { User } from "../models/user.model";

export interface PaginatedUsers {
    users: User[];
    pagination: {
        totalCount: number;
        currentPage: number;
        totalPages: number;
    };
}

export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'USER' | 'INSTRUCTOR';
}

export interface UpdateUserData {
    name: string;
    email: string;
    profile_pic?: string;
}