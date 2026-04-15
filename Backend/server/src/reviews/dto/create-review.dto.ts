import { IsString, IsNumber, IsNotEmpty, Min, Max, IsUUID } from 'class-validator';

export class CreateReviewDto {
    @IsNumber()
    @Min(1)
    @Max(5)
    @IsNotEmpty()
    rating: number;

    @IsString()
    @IsNotEmpty()
    comment: string;

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    productId: string;
}