import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity'; // (Aparecerá error hasta que creemos el producto, ignóralo un segundo)

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('bool', { default: true })
    isActive: boolean;

    // RELACIÓN: Una categoría tiene MUCHOS productos
    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}