import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // 1. Miramos qué roles exige la ruta (ej: ['admin'])
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
    
        // Si la ruta no exige ningún rol, la dejamos pasar
        if (!requiredRoles) {
            return true;
        }
    
        // 2. Sacamos al usuario de la petición (el AuthGuard ya lo puso ahí antes)
        const { user } = context.switchToHttp().getRequest();
    
        // 3. Comparamos: ¿El usuario tiene alguno de los roles requeridos?
        // Asumimos que user.roles es un texto como "admin" o "user", o un array ['admin']
        const hasRole = requiredRoles.some((role) => user?.roles?.includes(role));
    
        if (!hasRole) {
            throw new ForbiddenException('Acceso denegado. Se requieren permisos de administrador.');
        }
    
        return true;
    }
}