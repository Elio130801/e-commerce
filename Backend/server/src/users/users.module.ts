import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar esto
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity'; // Importar tu entidad User

@Module({
  imports: [
    // AQUÍ REGISTRAMOS LA ENTIDAD:
    TypeOrmModule.forFeature([User]) 
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], 
})
export class UsersModule {}