import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Review } from './review.entity'
import { AggregatedReviews } from './reviews.types'

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

	async get(id: number): Promise<Review> {
		return this.repository.findOneBy({ id })
	}

	async update(review: Review, changes: Partial<Review>): Promise<Review> {
		Object.assign(review, changes)
		return await this.repository.save(review)
	}

	async list(productId: number) {
		return this.repository.findBy({ productId })
	}

	async getAggregated(productId: number): Promise<AggregatedReviews> {
		const results: AggregatedReviews[] = await this.repository
			.createQueryBuilder()
			.select(['product_id', 'count(*)', 'sum(rating)'])
			.where({ productId })
			.groupBy('product_id')
			.execute()
		if (results.length === 0) {
			return {
				count: 0,
				sum: 0,
			}
		}
		return {
			count: Number(results[0].count),
			sum: Number(results[0].sum),
		}
	}
}
