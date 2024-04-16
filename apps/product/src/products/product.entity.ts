import { ApiHideProperty } from '@nestjs/swagger'
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

	@Column({ type: 'float8' })
	price: number

	@Column({ nullable: true, type: 'float8' })
	averageRating: number

	@OneToMany(() => Review, (review) => review.product)
	@ApiHideProperty()
	reviews: Review[]
}
