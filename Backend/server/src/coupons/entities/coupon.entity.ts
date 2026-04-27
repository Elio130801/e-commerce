import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Coupon {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string; // Ej: BIENVENIDA10, VERANO20

    @Column('decimal', { precision: 5, scale: 2 })
    discountPercentage: number; // Ej: 10.00 para 10% de descuento

    @Column({ default: true })
    isActive: boolean; // Para poder apagar cupones sin borrarlos

    @CreateDateColumn()
    createdAt: Date;
}