import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Review } from '../../reviews/entities/review.entity';

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

    // 👇 NUEVO: Un producto tiene MUCHAS reseñas
    // eager: true hará que al pedir un producto, vengan sus reseñas automáticamente
    @OneToMany(() => Review, (review) => review.product, { eager: true })
    reviews: Review[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}   