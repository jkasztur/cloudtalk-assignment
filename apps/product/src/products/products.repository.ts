import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { MoreThan, Repository } from 'typeorm';
import { ListResponse } from './products.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsRepository {
	constructor(
		@InjectRepository(Product)
		private repository: Repository<Product>,
	) {}

	create(product: Partial<Product>): Promise<Product> {
		return this.repository.save(product);
	}

	async update(id: number, product: Partial<Product>): Promise<void> {
		await this.repository.update(id, product);
	}

	async delete(id: number): Promise<boolean> {
		const deleted = await this.repository.delete(id);
		return deleted.affected > 0;
	}

	/**
	 * Basic pagination. For next page, client should should send offset from its last request.
	 * Returned offset:null means there are no more items.
	 */
	async getAll(
		idOffset: number = null,
		limit: number = 100,
	): Promise<ListResponse<Product>> {
		const items = await this.repository.find({
			where: {
				id: MoreThan(idOffset),
			},
			take: limit ?? 0,
			order: { id: 'ASC' },
		});

		const newOffset = items.length > 0 ? items[items.length - 1].id : null;
		return { items, offset: newOffset };
	}

	async get(id: number): Promise<Product> {
		return this.repository.findOneBy({ id });
	}
}
