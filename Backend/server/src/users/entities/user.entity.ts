import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    BeforeInsert, 
    BeforeUpdate 
} from 'typeorm';
import * as bcrypt from 'bcrypt'; // 👈 Importamos la librería de seguridad

@Entity('users')
export class User {
  
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    fullName: string;

    @Column('text', { unique: true })
    email: string;

    // ℹ️ Select: false significa que cuando pidamos los usuarios, 
    // NO nos traiga la contraseña por defecto (por seguridad extra)
    @Column('text', { select: false }) 
    password: string;

    @Column('text', { default: 'client' })
    roles: string; 

    @Column('bool', { default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // 👇 AQUÍ OCURRE LA MAGIA DEL HASHING
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        // Si la contraseña ya está encriptada o no se ha modificado, no hacer nada
        if (!this.password) return;

        // Generar el "salt" (ruido aleatorio) y hashear
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }

    // 👇 ESTO LO USAREMOS LUEGO PARA EL LOGIN
    // Compara la contraseña que escribe el usuario con la encriptada
    async checkPassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
}