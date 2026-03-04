import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'; // 👈 Importamos crypto para generar el token

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async login(email: string, pass: string) {
        const cleanEmail = email.toLowerCase().trim();
        const user = await this.usersService.findByEmail(cleanEmail); 

        if (!user) throw new UnauthorizedException('Credenciales inválidas');
        
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

        // 👇 AÑADIMOS EL NOMBRE AL PAYLOAD DEL TOKEN
        const payload = { 
            sub: user.id, 
            email: user.email, 
            roles: user.roles,
            fullName: user.fullName // 👈 ¡La pieza mágica!
        };
        
        return {
            access_token: await this.jwtService.signAsync(payload),
            // También lo sumamos aquí por si el frontend lo necesita directo en la respuesta
            user: { 
                email: user.email, 
                roles: user.roles,
                fullName: user.fullName
            }
        };
    }

    async register(fullName: string, email: string, pass: string, roles?: string | string[]) {
        const cleanEmail = email.toLowerCase().trim();
        
        const userExists = await this.usersService.findByEmail(cleanEmail); 
        if (userExists) {
            throw new BadRequestException('Este correo electrónico ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(pass, 10);
        
        const newUser = await this.usersService.create({
            fullName: fullName,
            email: cleanEmail,
            password: hashedPassword,
            roles: roles || ['user'] 
        } as any);

        return { 
            message: 'Usuario registrado exitosamente',
            user: { id: newUser.id, email: newUser.email, roles: newUser.roles }
        };
    }

    // 👇 NUEVO: Generar Token de Recuperación
    async forgotPassword(email: string) {
        const cleanEmail = email.toLowerCase().trim();
        const user = await this.usersService.findByEmail(cleanEmail);

        if (!user) {
            // Por seguridad, no decimos si el correo existe o no a los atacantes
            return { message: 'Si el correo existe, se enviaron las instrucciones.' };
        }

        // Generamos un token seguro de 32 caracteres
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        await this.usersService.save(user);

        // En producción enviaríamos un correo. Por ahora lo devolvemos en la respuesta:
        return {
            message: 'Si el correo existe, se enviaron las instrucciones.',
            simulateEmailLink: `http://localhost:3000/reset-password?token=${token}`
        };
    }

    // 👇 NUEVO: Actualizar la contraseña
    async resetPassword(token: string, newPass: string) {
        const user = await this.usersService.findByResetToken(token);

        if (!user) {
            throw new BadRequestException('El enlace es inválido o ya expiró.');
        }

        user.password = await bcrypt.hash(newPass, 10);
        user.resetPasswordToken = null; // Inhabilitamos el token para que no se use dos veces
        
        await this.usersService.save(user);
        return { message: '¡Contraseña actualizada con éxito!' };
    }
}