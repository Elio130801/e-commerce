import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            // 1. Decimos: "El token vendrá en la cabecera 'Authorization' como 'Bearer ...'"
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // Si el token expiró, rechazar
            secretOrKey: "CLAVE_SECRETA_SUPER_SEGURA", // ⚠️ DEBE SER LA MISMA QUE PUSISTE EN AUTH.MODULE
        });
    }

    // 2. Si el token es válido, NestJS ejecuta esto y nos da los datos que venían dentro
    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email, roles: payload.roles };
    }
}