import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK) // Para devolver código 200 en vez de 201
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.login(signInDto.email, signInDto.password);
    }

    @Post('register')
    register(@Body() registerDto: Record<string, any>) {
        // Recibimos nombre, email y contraseña desde el Frontend y se los pasamos al servicio
        return this.authService.register(
            registerDto.name, 
            registerDto.email, 
            registerDto.password,
            registerDto.roles
        );
    }
}