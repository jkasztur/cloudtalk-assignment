import { Product } from 'src/products/product.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Review {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ length: 128, nullable: true })
	firstName: string

	@Column({ length: 128, nullable: true })
	lastName: string

	@Column({ length: 1024, nullable: true })
	text: string

	@Column({ type: 'int2' })
	rating: number

	@Column()
	productId: number

	@ManyToOne(() => Product, (product) => product.reviews)
	product: Product
}
