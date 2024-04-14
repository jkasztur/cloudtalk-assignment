import { Injectable } from '@nestjs/common'
import { ReviewsRepository } from './reviews.repository'
import { Review } from './review.entity'

@Injectable()
export class ReviewsService {
	constructor(private repository: ReviewsRepository) {}

	async create(data: Partial<Review>): Promise<Review> {
		const review = await this.repository.create(data)
		await this.sendEvent()
		return review
	}

	private async sendEvent() {
		// TODO: send data to amqp
	}
}
