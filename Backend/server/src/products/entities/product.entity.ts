import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    description: string;

    // Usamos 'float' o 'decimal' para dinero. 
    // 'decimal' es más preciso para e-commerce real.
    @Column('decimal', { precision: 10, scale: 2 }) 
    price: number;

    @Column('int')
    stock: number;

    @Column('bool', { default: true })
    isActive: boolean;

    // Por ahora guardaremos la URL de la imagen como texto simple.
    // Más adelante conectaremos Cloudinary.
    @Column('text')
    slug: string; // Para la URL amigable (ej: crema-hidratante-lumiere)

    @Column('text', { array: true }) // Un array de textos para varias fotos
    images: string[];

    // RELACIÓN: Muchos productos pertenecen a UNA categoría
    // eager: true significa que cuando pida un producto, traiga automáticamente su categoría
    @ManyToOne(() => Category, (category) => category.products, { eager: true })
    category: Category;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}   