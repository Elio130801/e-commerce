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
        const cleanEmail = email.toLowerCase().trim();
        
        console.log("--- INTENTO DE LOGIN ---");
        console.log("Email buscando:", cleanEmail);

        const user = await this.usersService.findByEmail(cleanEmail); 
        console.log("¿Usuario encontrado?:", user ? "SÍ" : "NO");

        if (!user) {
            console.log("Fallo -> El correo no existe en la BD.");
            throw new UnauthorizedException('Credenciales inválidas');
        }

        console.log("Hash en BD:", user.password);
        
        const isMatch = await bcrypt.compare(pass, user.password);
        console.log("¿Las contraseñas coinciden?:", isMatch ? "SÍ" : "NO");
        
        if (!isMatch) {
            console.log("Fallo -> La contraseña es incorrecta.");
            throw new UnauthorizedException('Credenciales inválidas');
        }

        console.log("¡ÉXITO! -> Generando token...");
        const payload = { sub: user.id, email: user.email, roles: user.roles };
        
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: { 
                email: user.email,
                roles: user.roles
            }
        };
    }

    // 👇 Cambiamos 'name' por 'fullName' en los parámetros
    async register(fullName: string, email: string, pass: string, roles?: string | string[]) {
        const cleanEmail = email.toLowerCase().trim();
        
        const userExists = await this.usersService.findByEmail(cleanEmail); 
        if (userExists) {
            throw new BadRequestException('Este correo electrónico ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(pass, 10);
        
        const newUser = await this.usersService.create({
            fullName: fullName, // 👈 Todo alineado
            email: cleanEmail,
            password: hashedPassword, // 🚨 CORREGIDO: Ahora sí guardamos la contraseña encriptada
            roles: roles || ['user'] 
        } as any);

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