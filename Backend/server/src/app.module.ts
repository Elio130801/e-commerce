import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // AQUÍ CONFIGURAMOS LA CONEXIÓN A LA BASE DE DATOS
    TypeOrmModule.forRoot({
      type: 'postgres',       // Tipo de base de datos
      host: 'localhost',      // Dónde está (tu pc)
      port: 5432,             // Puerto por defecto de Postgres
      username: 'postgres',   // ⚠️ TU USUARIO (suele ser postgres)
      password: '1234',       // ⚠️ TU CONTRASEÑA (cámbiala por la tuya)
      database: 'e_commerce', // Nombre de la DB que creamos en DBeaver
      autoLoadEntities: true,         // Aquí irán las tablas (Productos, Usuarios...)
      synchronize: true,      // ¡IMPORTANTE!: Esto crea las tablas automáticamente (como el migrate de Django). Solo usar en desarrollo.
    }),
    UsersModule,
    CategoriesModule,
    ProductsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}