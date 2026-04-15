import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  // Nueva ruta para obtener reseñas por producto
  @Get('product/:productId')
  findAllByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findAllByProduct(productId);
  }
}