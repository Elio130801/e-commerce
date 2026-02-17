import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity'; // Importar

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // Registrar
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}