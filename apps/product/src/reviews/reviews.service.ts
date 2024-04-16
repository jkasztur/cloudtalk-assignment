import { Inject, Injectable } from '@nestjs/common'
import { ReviewsRepository } from './reviews.repository'
import { Review } from './review.entity'
import { ClientProxy } from '@nestjs/microservices'
import { ReviewCreated, ReviewDeleted, ReviewUpdated } from '../app.events'
import pick from 'object.pick'
import { ProductsService } from 'src/products/products.service'
import omit from 'object.omit'

@Injectable()
export class ReviewsService {
	constructor(
		private productService: ProductsService,
		private repository: ReviewsRepository,
		@Inject('RP_QUEUE') private rpQueue: ClientProxy,
	) {}

	async create(data: Partial<Review>): Promise<Review> {
		const product = await this.productService.getById(data.productId)
		if (!product) {
			return null
		}
		const review = await this.repository.create(data)
		this.sendEvent('review.created', pick(review, ['productId', 'rating']))
		return review
	}

	async delete(id: number): Promise<boolean> {
		const review = await this.repository.get(id)
		if (!review) {
			return false
		}
		const deleted = await this.repository.delete(id)
		if (deleted) {
			this.sendEvent('review.deleted', pick(review, ['productId', 'rating']))
		}
	}

	async update(id: number, changes: Partial<Review>): Promise<Review> {
		const review = await this.repository.get(id)
		if (!review) {
			return null
		}
		const updated = await this.repository.update(
			review,
			omit(changes, ['id', 'productId']),
		)
		if (updated) {
			this.sendEvent('review.updated', {
				productId: review.productId,
				newRating: updated.rating,
				oldRating: review.rating,
			})
		}
		return updated
	}

	async getForProduct(productId: number): Promise<Review[]> {
		return this.repository.list(productId)
	}

	private sendEvent(event: 'review.created', data: ReviewCreated): void
	private sendEvent(event: 'review.deleted', data: ReviewDeleted): void
	private sendEvent(event: 'review.updated', data: ReviewUpdated): void
	private sendEvent<T>(event: string, data: T) {
		this.rpQueue.emit(event, data)
	}
}
