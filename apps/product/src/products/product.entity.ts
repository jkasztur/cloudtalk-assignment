import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 128 })
	name: string;

	@Column({ length: 256 })
	description: string;

	@Column()
	price: number;
}
