import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// Este decorador nos permitirá poner @Roles('admin') arriba de nuestras rutas
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);