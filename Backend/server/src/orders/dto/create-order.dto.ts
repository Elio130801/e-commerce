import { IsString, IsEmail, IsNumber, IsArray, IsNotEmpty, IsOptional} from 'class-validator';

export class CreateOrderDto {
    @IsString()
    @IsOptional()
    userId?: string;
    
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