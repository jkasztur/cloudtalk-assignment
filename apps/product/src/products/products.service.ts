import { Injectable } from '@nestjs/common'
import { ProductsRepository } from './products.repository'
import { Product } from './product.entity'

@Injectable()
export class ProductsService {
	constructor(private repository: ProductsRepository) {}

	async create(product: Partial<Product>): Promise<Product> {
		return this.repository.create(product)
	}

	async delete(id: number) {
		const deleted = await this.repository.delete(id)
		return { deleted }
	}

	async update(id: number, changes: Partial<Product>): Promise<Product> {
		const product = await this.repository.get(id)
		if (!product) {
			return null
		}
		return this.repository.update(product, changes)
	}

	getById(id: number) {
		return this.repository.get(id)
	}
}
