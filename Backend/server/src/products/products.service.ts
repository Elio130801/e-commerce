import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    // TypeORM es inteligente: si le pasas { category: { id: "..." } } él hace la relación.
    // Pero como recibimos 'categoryId', hacemos un pequeño truco de mapeo:
    const { categoryId, ...productData } = createProductDto;
    
    const product = this.productRepository.create({
      ...productData,
      category: { id: categoryId }, // Vinculamos por ID
    });
    
    return await this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find();
  }

  async findOne(id: string) { 
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // 1. Preload: Busca el producto y reemplaza SOLO los datos que enviamos
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });

    // 2. Si no existe el ID, lanzamos error
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // 3. Guardamos los cambios
    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id); // Reutilizamos findOne para verificar que existe
    return await this.productRepository.remove(product);
  }
}
