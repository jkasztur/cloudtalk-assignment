import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRedis } from '@songkeys/nestjs-redis'
import Redis from 'ioredis'
import { ProductsRepository } from './products.repository'

@Injectable()
export class ProductRatingService {
	private readonly logger = new Logger(ProductRatingService.name)

	constructor(
		@InjectRedis() private readonly redis: Redis,
		private readonly repository: ProductsRepository,
	) {}

	async scheduleUpdate(productId: number, average: number) {
		await this.redis.hset(this.key(), `${productId}`, average)
	}

	async getCachedRating(productId: number): Promise<number> {
		const average = await this.redis.hget(this.key(), `${productId}`)
		return average ? parseFloat(average) : null
	}

	@Cron(CronExpression.EVERY_MINUTE)
	async persistCached() {
		const result = await this.redis
			.multi()
			.hgetall(this.key())
			.del(this.key())
			.exec()
		const toUpdate: Record<string, string> = result[0][1] as Record<
			string,
			string
		>
		if (Object.keys(toUpdate).length === 0) {
			return
		}
		this.logger.log(`Storing ${Object.keys(toUpdate).length} values`)
		await this.repository.bulkUpdateRating(toUpdate)
	}

	private key() {
		return 'ratings:update_scheduled'
	}
}
