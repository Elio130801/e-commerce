import { IsString, IsEmail, IsNumber, IsArray, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    customerName: string;

    @IsEmail()
    customerEmail: string;

    @IsNumber()
    total: number;

    @IsArray()
    items: any[];

}