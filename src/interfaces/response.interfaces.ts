export interface Response {
    success: boolean;
    message: string;
    data?: unknown;
    totalData?: number;
}

export interface RemoveMediaResponse {
    success: boolean,
    message: string
}