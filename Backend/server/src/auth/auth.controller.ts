import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
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
    register(@Body() registerDto: CreateUserDto) {
        return this.authService.register(registerDto.fullName, registerDto.email, registerDto.password, registerDto.roles);
    }

    // 👇 NUEVAS RUTAS
    @Post('forgot-password')
    forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }

    @Post('reset-password')
    resetPassword(@Body() body: Record<string, any>) {
        return this.authService.resetPassword(body.token, body.password);
    }
}
