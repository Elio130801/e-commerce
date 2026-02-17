export class CreateUserDto {
    fullName: string;
    email: string;
    password: string;
    roles: string; // Aquí diremos si es 'admin' o 'client'
}

