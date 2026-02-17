import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity'; // Importar

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // Registrar
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
