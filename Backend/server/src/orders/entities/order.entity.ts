import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from 'typeorm';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ nullable: true })
    userId: string;

    @Column()
    customerName: string;

    @Column()
    customerEmail: string;
    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column('json')
    items: any[];

    @Column({ default: 'PENDING' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}