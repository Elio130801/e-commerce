// client/types/index.ts

export interface Product {
    id: string;
    name: string;
    description: string;
    price: string; // Ojo: A veces el decimal viene como string del backend
    images: string[];
    slug: string;
    isActive: boolean;
}