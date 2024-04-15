import { RedisLockService } from '@huangang/nestjs-simple-redis-lock'
import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@songkeys/nestjs-redis'
import Redis from 'ioredis'

const EXPIRE = 1000 * 60 * 60 * 24 * 7 // 1 week

@Injectable()
export class ProcessingService {
	constructor(
		@InjectRedis() private readonly redis: Redis,
		private readonly lockService: RedisLockService,
	) {}

	async getAverage(productId: number) {
		await this.init(productId)
		const [sum, count] = await this.redis.hmget(
			this.key(productId),
			'sum',
			'count',
		)
		if (count === null) {
			return null
		}
		return parseInt(sum) / parseInt(count)
	}

	async addReview(productId: number, rating: number) {
		await this.lock(productId, async () => {
			const key = this.key(productId)
			await this.init(productId)
			// TODO: use Lua script for faster processing?
			await this.redis
				.multi()
				.hincrby(key, 'sum', rating)
				.hincrby(key, 'count', 1)
				.expire(key, EXPIRE)
				.exec()
		})
	}

	async removeReview(productId: number, rating: number) {
		await this.lock(productId, async () => {
			const key = this.key(productId)
			await this.init(productId)
			await this.redis
				.multi()
				.hincrby(key, 'sum', -rating)
				.hincrby(key, 'count', -1)
				.expire(key, EXPIRE)
				.exec()
		})
	}

	async updateReview(productId: number, oldRating: number, newRating: number) {
		await this.lock(productId, async () => {
			const key = this.key(productId)
			await this.init(productId)
			await this.redis
				.multi()
				.hincrby(key, 'sum', newRating - oldRating)
				.hget(key, 'count')
				.expire(key, EXPIRE)
				.exec()
		})
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
		// TODO: fetch persisted values from product
		const key = this.key(productId)
		await this.redis
			.multi()
			.hset(key, 'sum', 0)
			.hset(key, 'count', 0)
			.expire(key, EXPIRE)
			.exec()
	}

	private key(productId: number) {
		return `product:${productId}:average`
	}
}
