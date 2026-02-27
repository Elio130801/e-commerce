import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    fullName: string;

    @Column('text', { unique: true })
    email: string;

    @Column('text', { select: false }) 
    password: string;

    @Column('text', { default: 'client' })
    roles: string; 

    @Column('bool', { default: true })
    isActive: boolean;

    // 👇 NUEVA COLUMNA: Para guardar el código temporal de recuperación
    @Column('text', { nullable: true })
    resetPasswordToken: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}