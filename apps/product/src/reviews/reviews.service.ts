import { Inject, Injectable } from '@nestjs/common'
import { ReviewsRepository } from './reviews.repository'
import { Review } from './review.entity'
import { ClientProxy } from '@nestjs/microservices'
import { ReviewCreated, ReviewDeleted } from './reviews.types'
import pick from 'object.pick'

@Injectable()
export class ReviewsService {
	constructor(
		private repository: ReviewsRepository,
		@Inject('RP_QUEUE') private rpQueue: ClientProxy,
	) {}

	async create(data: Partial<Review>): Promise<Review> {
		const review = await this.repository.create(data)
		this.sendEvent('review.created', pick(review, ['productId', 'rating']))
		return review
	}

	sendEvent(event: 'review.created', data: ReviewCreated): void
	sendEvent(event: 'review.deleted', data: ReviewDeleted): void
	sendEvent(event: 'review.updated', data: any): void
	sendEvent<T>(event: string, data: T) {
		this.rpQueue.emit(event, data)
	}
}
