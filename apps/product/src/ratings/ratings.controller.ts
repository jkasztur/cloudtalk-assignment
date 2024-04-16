import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { AverageUpdated, EventType } from 'src/app.events'

@Controller()
export class RatingsController {
	private readonly logger = new Logger(RatingsController.name)

	@MessagePattern(EventType.AverageUpdated)
	async handleReviewCreated(@Payload() data: AverageUpdated) {
		this.logger.debug(
			`Received event ${EventType.AverageUpdated} with data ${JSON.stringify(data)}`,
		)
		// TODO
		this.logger.debug('Processed event review.created')
	}
}
