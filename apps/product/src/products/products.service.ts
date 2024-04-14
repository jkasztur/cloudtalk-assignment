import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
	constructor(private repository: ProductsRepository) {}

	async create(product: Partial<Product>): Promise<Product> {
		return this.repository.create(product);
	}
}
