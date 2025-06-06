import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type ProductKeys = keyof Product;

@Entity('products')
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: false, type: 'timestamp' })
    validity: Date;

    @Column({ nullable: false })
    price: number;
}
