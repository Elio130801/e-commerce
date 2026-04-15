import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    // 1. Buscamos el producto al que pertenece la reseña
    const product = await this.productRepository.findOneBy({ id: createReviewDto.productId });
    
    if (!product) {
      throw new NotFoundException(`Producto con ID ${createReviewDto.productId} no encontrado`);
    }

    // 2. Creamos la reseña y le asignamos el producto
    const review = this.reviewRepository.create({
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      userName: createReviewDto.userName,
      product: product, 
    });

    // 3. Guardamos en la base de datos
    return await this.reviewRepository.save(review);
  }

  // Función para traer solo las reseñas de un producto
  async findAllByProduct(productId: string) {
    return await this.reviewRepository.find({
      where: { product: { id: productId } },
      order: { createdAt: 'DESC' } // Las más nuevas primero
    });
  }
}