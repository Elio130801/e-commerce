import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
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

  async findAll(query?: string) {
    if (query) {
      return await this.productRepository.find({
        where: [
          { name: ILike(`%${query}%`) },
          { description: ILike(`%${query}%`) }
        ]
      });
    }
    return await this.productRepository.find();
  }

  async findOne(term: string) { 
    let product: Product | null;

    // Usamos una expresión regular para saber si el texto (term) tiene forma de UUID
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(term);

    if (isUUID) {
      // Si tiene forma de ID largo, buscamos por ID (Útil para el panel de Admin)
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // Si son palabras, buscamos por la columna slug (Útil para la tienda web)
      product = await this.productRepository.findOneBy({ slug: term });
    }

    if (!product) {
      throw new NotFoundException(`Producto con identificador ${term} no encontrado`);
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
