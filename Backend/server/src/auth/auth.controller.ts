import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
// 👇 Importamos el DTO para que el guardia aplique las validaciones (Ajusta la ruta si es diferente)
import { CreateUserDto } from '../users/dto/create-user.dto'; 

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK) 
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.login(signInDto.email, signInDto.password);
    }

    @Post('register')
    // 👇 Le decimos a NestJS que use el DTO aquí
    register(@Body() registerDto: CreateUserDto) {
        return this.authService.register(
            registerDto.fullName, // 👈 CORREGIDO: Ahora busca fullName
            registerDto.email, 
            registerDto.password,
            registerDto.roles
        );
    }
}