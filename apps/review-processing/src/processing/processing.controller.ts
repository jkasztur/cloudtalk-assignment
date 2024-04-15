import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ProcessingService } from './processing.service'
import {
	EventType,
	ReviewCreated,
	ReviewDeleted,
	ReviewUpdated,
} from './processing.types'

@Controller()
export class ProcessingController {
	private readonly logger = new Logger(ProcessingController.name)

	constructor(private service: ProcessingService) {}

	@MessagePattern(EventType.ReviewCreated)
	async handleReviewCreated(@Payload() data: ReviewCreated) {
		await this.service.addReview(data.productId, data.rating)
		const avg = await this.service.getAverage(data.productId)
		this.logger.log(`Average rating for product ${data.productId}: ${avg}`)
		this.logger.log('Processed event review.created')
	}

	@MessagePattern(EventType.ReviewDeleted)
	async handleReviewDeleted(@Payload() data: ReviewDeleted) {
		await this.service.removeReview(data.productId, data.rating)
		const avg = await this.service.getAverage(data.productId)
		this.logger.log(`Average rating for product ${data.productId}: ${avg}`)
		this.logger.log('Processed event review.deleted', data)
	}

	@MessagePattern(EventType.ReviewUpdated)
	async handleReviewUpdated(@Payload() data: ReviewUpdated) {
		await this.service.updateReview(
			data.productId,
			data.oldRating,
			data.newRating,
		)
		const avg = await this.service.getAverage(data.productId)
		this.logger.log(`Average rating for product ${data.productId}: ${avg}`)
		this.logger.log('Processed event review.updated', data)
	}
}
