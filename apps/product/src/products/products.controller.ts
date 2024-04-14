import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Delete,
	Param,
	Patch,
	NotFoundException,
	BadRequestException,
	Get,
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductRequest, UpdateProductRequest } from './products.dto'
import { ApiTags } from '@nestjs/swagger'
import { Product } from './product.entity'
import { DeleteResponse } from 'src/app.dto'

@Controller('/products')
@ApiTags('products')
export class ProductsController {
	constructor(private service: ProductsService) {}

	@Post('/')
	@HttpCode(HttpStatus.OK)
	create(@Body() body: CreateProductRequest): Promise<Product> {
		return this.service.create(body)
	}

	@Delete('/:id')
	@HttpCode(HttpStatus.OK)
	delete(@Param('id') id: number): Promise<DeleteResponse> {
		return this.service.delete(id)
	}

	@Patch('/:id')
	async update(
		@Param('id') id: number,
		@Body() body: UpdateProductRequest,
	): Promise<Product> {
		if (Object.keys(body).length === 0) {
			throw new BadRequestException('No fields to update')
		}
		const updated = await this.service.update(id, body)
		if (!updated) {
			throw new NotFoundException('Product not found')
		}
		return updated
	}

	@Get('/:id')
	@HttpCode(HttpStatus.OK)
	async getById(@Param('id') id: number): Promise<Product> {
		const product = await this.service.getById(id)
		if (!product) {
			throw new NotFoundException('Product not found')
		}
		return product
	}
}
