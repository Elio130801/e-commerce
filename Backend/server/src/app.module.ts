import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',       
      host: 'localhost',      
      port: 5432,             
      username: 'postgres',   
      password: '1234',       
      database: 'e_commerce', 
      autoLoadEntities: true,         
      synchronize: true,      
    }),
    UsersModule,
    CategoriesModule,
    ProductsModule,
    AuthModule,
    OrdersModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}