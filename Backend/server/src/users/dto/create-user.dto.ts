import { IsString, IsEmail, MinLength, Matches, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsString({ message: 'El nombre debe ser un texto' })
    fullName: string;

    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/(?=.*[a-z])/, { message: 'La contraseña debe contener al menos una letra minúscula' })
    @Matches(/(?=.*[A-Z])/, { message: 'La contraseña debe contener al menos una letra mayúscula' })
    @Matches(/(?=.*\d)/, { message: 'La contraseña debe contener al menos un número' }) // 👇 Nueva validación de número
    @Matches(/(?=.*[\W_])/, { message: 'La contraseña debe contener al menos un carácter especial' })
    password: string;

    @IsOptional()
    @IsString()
    roles?: string; 
}