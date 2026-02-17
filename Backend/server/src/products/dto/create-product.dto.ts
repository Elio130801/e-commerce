export class CreateProductDto {
    name: string;
    description: string;
    price: number;
    stock: number;
    slug: string;
    images: string[];
    categoryId: string; // 👈 Importante: Solo enviamos el ID de la categoría
    isActive: boolean;
}   