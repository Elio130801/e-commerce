import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
// 👇 Importamos nuevos operadores de TypeORM para filtrar precios
import { ILike, Repository, Between, MoreThanOrEqual, LessThanOrEqual, FindOptionsWhere } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryId, ...productData } = createProductDto;
    const product = this.productRepository.create({
      ...productData,
      category: { id: categoryId }, 
    });
    return await this.productRepository.save(product);
  }

  // 👇 Lógica dinámica para construir los filtros
  async findAll(q?: string, minPrice?: number, maxPrice?: number, categoryId?: string) {
    let whereOptions: FindOptionsWhere<Product> | FindOptionsWhere<Product>[] = {};

    // Si hay búsqueda por texto, aplicamos el OR para nombre y descripción
    if (q) {
      whereOptions = [
        { name: ILike(`%${q}%`) },
        { description: ILike(`%${q}%`) }
      ];
    } else {
      whereOptions = {};
    }

    // Función que inyecta el rango de precio y categoría en las condiciones
    const applyFilters = (condition: FindOptionsWhere<Product>) => {
      if (categoryId) condition.category = { id: categoryId };
      
      if (minPrice !== undefined && maxPrice !== undefined) {
        condition.price = Between(minPrice, maxPrice);
      } else if (minPrice !== undefined) {
        condition.price = MoreThanOrEqual(minPrice);
      } else if (maxPrice !== undefined) {
        condition.price = LessThanOrEqual(maxPrice);
      }
      return condition;
    };

    if (Array.isArray(whereOptions)) {
      whereOptions = whereOptions.map(cond => applyFilters(cond));
    } else {
      whereOptions = applyFilters(whereOptions);
    }

    return await this.productRepository.find({
      where: whereOptions,
      relations: ['category'] 
    });
  }

  async findOne(term: string) { 
    let product: Product | null;
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(term);

    if (isUUID) {
      product = await this.productRepository.findOne({
        where: { id: term},
        relations: ['category']
      });
    } else {
      product = await this.productRepository.findOne({
        where: { slug: term },
        relations: ['category']
      });
    }

    if (!product) {
      throw new NotFoundException(`Producto con identificador ${term} no encontrado`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { categoryId, ...productData } = updateProductDto;
    const updateData: any = { id: id, ...productData };

    if (categoryId) {
      updateData.category = { id: categoryId };
    }

    const product = await this.productRepository.preload(updateData);
    if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`);

    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id); 
    return await this.productRepository.remove(product);
  }
}