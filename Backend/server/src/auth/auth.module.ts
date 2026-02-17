import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module'; // Importamos usuarios
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule, // Para poder buscar usuarios
    JwtModule.register({
      global: true, // Para que funcione en toda la app
      secret: "CLAVE_SECRETA_SUPER_SEGURA", // ⚠️ En producción esto va en variables de entorno (.env)
      signOptions: { expiresIn: '1d' }, // El token expira en 1 día
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}