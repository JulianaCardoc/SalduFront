export interface Product {
    id: number;
    sku: string;
    description: string;
    imagesUrl: string;
    urlImage1: string;
    urlImage2: string;
    urlImage3: string;
    urlImage4: string;
}

export interface UploadResponse {
    total: number;
    processed: number;
    rejected: number;
    rejectedProducts: any;
    load: Load;
}

export interface UpdateImageResponse {
    id: number;
    imagesUrl: string;
}

export interface Load {
    id: number;
    providerId: number;
    reference: string;
    createdAt: string;
}

export interface WooProduct {
    id: number;
    name: string;
    description: string;
    status: string;
    price: number;
    images?: {
        id: number;
        date_created: string;
        date_created_gmt: string;
        date_modified: string;
        date_modified_gmt: string;
        src: string;
        name: string;
        alt: string;
    }[];
    stock_status?: string;
    stock_quantity?: number;
    sku: string;
}

export interface WooProductResponse {
    productsData: WooProduct[];
    totalElements: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
}