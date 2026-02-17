import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async login(email: string, pass: string) {
        // 1. Buscar usuario por email (Necesitamos crear este método en users.service)
        const user = await this.usersService.findByEmail(email); 

    if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Verificar contraseña (comparar texto plano con hash)
    const isMatch = await bcrypt.compare(pass, user.password);
    
    if (!isMatch) {
        throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Generar el Token (Payload = datos que van dentro del token)
    const payload = { sub: user.id, email: user.email, roles: user.roles };
    
    return {
        access_token: await this.jwtService.signAsync(payload),
        user: { // Devolvemos también datos básicos para el frontend
            email: user.email,
            roles: user.roles
            }
        };
    }
}