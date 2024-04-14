import { Review } from 'src/reviews/review.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Product {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ length: 128 })
	name: string

	@Column({ length: 256 })
	description: string

	@Column()
	price: number

	@OneToMany(() => Review, (review) => review.product)
	reviews: Review[]

	averageRating?: number | null
}
