import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Review } from './review.entity'

@Injectable()
export class ReviewsRepository {
	constructor(
		@InjectRepository(Review)
		private repository: Repository<Review>,
	) {}

	create(product: Partial<Review>): Promise<Review> {
		return this.repository.save(product)
	}

	async delete(id: number): Promise<boolean> {
		const deleted = await this.repository.delete(id)
		return deleted.affected > 0
	}
}
