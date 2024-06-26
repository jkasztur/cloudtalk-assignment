import { InjectRepository } from '@nestjs/typeorm'
import { Product } from './product.entity'
import { MoreThan, Repository } from 'typeorm'
import { ListResponse } from './products.types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ProductsRepository {
	constructor(
		@InjectRepository(Product)
		private repository: Repository<Product>,
	) {}

	create(product: Partial<Product>): Promise<Product> {
		return this.repository.save(product)
	}

	async update(product: Product, changes: Partial<Product>): Promise<Product> {
		Object.assign(product, changes)
		return await this.repository.save(product)
	}

	async delete(id: number): Promise<boolean> {
		const deleted = await this.repository.delete(id)
		return deleted.affected > 0
	}

	/**
	 * Basic pagination. For next page, client should should send offset from its last request.
	 * Returned offset:null means there are no more items.
	 * TODO: add pagination also to other endpoints
	 */
	async getAll(
		idOffset: number,
		limit: number,
	): Promise<ListResponse<Product>> {
		const items = await this.repository.find({
			where: {
				id: MoreThan(Number.isInteger(idOffset) ? idOffset : 0),
			},
			take: Number.isInteger(limit) ? limit : 100,
			order: { id: 'ASC' },
		})

		const newOffset = items.length > 0 ? items[items.length - 1].id : null
		return { items, offset: newOffset }
	}

	async get(id: number): Promise<Product> {
		return this.repository.findOneBy({ id })
	}

	async bulkUpdateRating(toUpdate: Record<string, string>) {
		await this.repository.manager.transaction(async (manager) => {
			for (const [productId, averageRating] of Object.entries(toUpdate)) {
				await manager
					.createQueryBuilder()
					.update(Product)
					.set({ averageRating: parseFloat(averageRating) })
					.where({ id: Number(productId) })
					.execute()
			}
		})
	}
}
