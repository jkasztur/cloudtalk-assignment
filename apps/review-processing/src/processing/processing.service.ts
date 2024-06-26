import { RedisLockService } from '@huangang/nestjs-simple-redis-lock'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectRedis } from '@songkeys/nestjs-redis'
import Redis from 'ioredis'
import { AggregatedReviews, EventType } from './processing.types'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'

const EXPIRE = 1000 * 60 * 60 * 24 * 7 // 1 week

@Injectable()
export class ProcessingService {
	private readonly logger = new Logger(ProcessingService.name)

	constructor(
		@InjectRedis() private readonly redis: Redis,
		private readonly lockService: RedisLockService,
		@Inject('PRODUCT_QUEUE') private readonly productQueue: ClientProxy,
		private readonly httpService: HttpService,
		private readonly config: ConfigService,
	) {}

	async getAverage(productId: number) {
		await this.init(productId)
		const avg = await this.redis.hget(this.key(productId), 'avg')
		return parseFloat(avg)
	}

	async addReview(productId: number, rating: number) {
		await this.lock(productId, async () => {
			await this.updateValues(productId, rating, 1)
		})
	}

	async removeReview(productId: number, rating: number) {
		await this.lock(productId, async () => {
			await this.updateValues(productId, -rating, -1)
		})
	}

	async updateReview(productId: number, oldRating: number, newRating: number) {
		await this.lock(productId, async () => {
			await this.updateValues(productId, newRating - oldRating, 0)
		})
	}

	private async updateValues(
		productId: number,
		addedSum: number,
		addedCount: number,
	) {
		const key = this.key(productId)
		await this.init(productId)
		const [[, sum], [, count]] = await this.redis
			.multi()
			.hincrby(key, 'sum', addedSum)
			.hincrby(key, 'count', addedCount)
			.expire(key, EXPIRE)
			.exec()

		const newAvg = this.avg(sum as string, count as string)
		await this.redis.hset(key, 'avg', newAvg)
		this.notify(productId, newAvg)
	}

	private notify(productId: number, newAvg: number) {
		this.logger.debug(
			`Average rating changed for product ${productId} to ${newAvg}, notifying`,
		)
		this.productQueue.emit(EventType.AverageUpdated, {
			productId,
			average: newAvg,
		})
	}

	private avg(sum: number | string, count: number | string): number {
		sum = this.numberize(sum)
		count = this.numberize(count)
		if (count === 0) {
			return null
		}
		return sum / count
	}

	private numberize(num: number | string): number {
		return typeof num === 'number' ? num : parseInt(num)
	}

	private async lock(productId: number, fn: () => Promise<any>) {
		await this.lockService.lock(`product:${productId}`, 1000 * 60, 50)
		try {
			await fn()
		} finally {
			await this.lockService.unlock(`product:${productId}`)
		}
	}

	private async init(productId: number) {
		if ((await this.redis.exists(this.key(productId))) === 1) {
			return
		}
		const fetched = await this.fetchAggregatedReviews(productId)
		const key = this.key(productId)
		await this.redis
			.multi()
			.hset(key, 'sum', fetched.sum)
			.hset(key, 'count', fetched.count)
			.expire(key, EXPIRE)
			.exec()
	}

	private async fetchAggregatedReviews(
		productId: number,
	): Promise<AggregatedReviews> {
		const url = `${this.config.get('product').host}/products/${productId}/reviews-aggregated`
		const response = await this.httpService.axiosRef.get(url)
		this.logger.debug(
			`Fetched data for product ${productId}: ${JSON.stringify(response.data)}`,
		)
		return response.data
	}

	private key(productId: number) {
		return `product:${productId}:average`
	}
}
