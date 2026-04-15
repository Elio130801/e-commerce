import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int')
    rating: number; // 1 a 5 estrellas

    @Column('text')
    comment: string;

    @Column('text')
    userName: string; // Guardamos el nombre del cliente directamente para agilizar lecturas

    // RELACIÓN: Muchas reseñas pertenecen a UN producto
    // onDelete: 'CASCADE' asegura que si eliminas un producto, no queden reseñas huérfanas
    @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
    product: Product;

    @CreateDateColumn()
    createdAt: Date;
}