import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsNumber()
    stock: number;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsArray()
    images: string[];

    // Lo ponemos como opcional por ahora para que no te bloquee si no eliges categoría en el Frontend
    @IsString()
    @IsOptional() 
    categoryId?: string; 

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}