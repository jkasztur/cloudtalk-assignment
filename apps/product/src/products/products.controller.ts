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
	Logger,
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductRequest, UpdateProductRequest } from './products.dto'
import { ApiTags } from '@nestjs/swagger'
import { Product } from './product.entity'
import { DeleteResponse } from 'src/app.dto'
import { ReviewsService } from 'src/reviews/reviews.service'
import { Review } from 'src/reviews/review.entity'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { AverageUpdated, EventType } from 'src/app.events'
import { ProductRatingService } from './product-rating.service'

@Controller('/products')
@ApiTags('products')
export class ProductsController {
	private readonly logger = new Logger(ProductsController.name)
	constructor(
		private service: ProductsService,
		private reviewService: ReviewsService,
		private ratingService: ProductRatingService,
	) {}

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

	@Get('/:id/reviews')
	@HttpCode(HttpStatus.OK)
	async getReviews(@Param('id') id: number): Promise<Review[]> {
		// TODO: use pagination? currently returns all
		return this.reviewService.getForProduct(id)
	}

	@MessagePattern(EventType.AverageUpdated)
	async handleAverageUpdated(@Payload() data: AverageUpdated) {
		this.logger.debug(
			`Received event ${EventType.AverageUpdated} with data ${JSON.stringify(data)}`,
		)
		await this.ratingService.scheduleUpdate(data.productId, data.average)
		this.logger.debug('Processed event review.created')
	}
}
