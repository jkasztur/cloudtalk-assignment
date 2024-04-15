import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

@Controller()
export class ProcessingController {
	private readonly logger = new Logger(ProcessingController.name)

	@MessagePattern('review.created')
	async handleReviewCreated(@Payload() data: any) {
		// TODO
		this.logger.log('Processed event review.created', data)
	}

	@MessagePattern('review.deleted')
	async handleReviewDeleted(@Payload() data: any) {
		// TODO
		this.logger.log('Processed event review.deleted', data)
	}

	@MessagePattern('review.updated')
	async handleReviewUpdated(@Payload() data: any) {
		// TODO
		this.logger.log('Processed event review.updated', data)
	}
}
