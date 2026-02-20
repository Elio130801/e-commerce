import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
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

    async register(name: string, email: string, pass: string) {
        // 1. Verificamos si el correo ya existe en la base de datos
        const userExists = await this.usersService.findByEmail(email); 
        if (userExists) {
            throw new BadRequestException('Este correo electrónico ya está registrado');
        }

        // 2. Encriptamos la contraseña por seguridad
        const hashedPassword = await bcrypt.hash(pass, 10);
        
        // 3. Creamos el usuario en la base de datos. 
        // Le forzamos el rol ['user'] para que no tenga permisos de administrador.
        // Usamos "as any" por si tu CreateUserDto no tiene la propiedad roles definida explícitamente.
        const newUser = await this.usersService.create({
            fullName: name,
            email,
            password: hashedPassword,
            roles: ['user'] 
        } as any);

        // 4. Devolvemos un mensaje de éxito y los datos básicos (nunca la contraseña)
        return { 
            message: 'Usuario registrado exitosamente',
            user: {
                id: newUser.id,
                email: newUser.email,
                roles: newUser.roles
            }
        };
    }
}