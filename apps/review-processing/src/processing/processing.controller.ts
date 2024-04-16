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
		this.logger.debug(
			`Received event ${EventType.ReviewCreated} with data ${JSON.stringify(data)}`,
		)
		await this.service.addReview(data.productId, data.rating)
		this.logger.debug('Processed event review.created')
	}

	@MessagePattern(EventType.ReviewDeleted)
	async handleReviewDeleted(@Payload() data: ReviewDeleted) {
		this.logger.debug(
			`Received event ${EventType.ReviewDeleted} with data ${JSON.stringify(data)}`,
		)
		await this.service.removeReview(data.productId, data.rating)
		this.logger.debug('Processed event review.deleted', data)
	}

	@MessagePattern(EventType.ReviewUpdated)
	async handleReviewUpdated(@Payload() data: ReviewUpdated) {
		this.logger.debug(
			`Received event ${EventType.ReviewUpdated} with data ${JSON.stringify(data)}`,
		)
		await this.service.updateReview(
			data.productId,
			data.oldRating,
			data.newRating,
		)
		this.logger.debug('Processed event review.updated', data)
	}
}
