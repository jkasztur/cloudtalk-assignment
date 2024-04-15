import {
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Body,
	NotFoundException,
	Delete,
	Param,
	Patch,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateReviewRequest, UpdateReviewRequest } from './reviews.dto'
import { ReviewsService } from './reviews.service'

@Controller('/reviews')
@ApiTags('reviews')
export class ReviewsController {
	constructor(private service: ReviewsService) {}

	@Post('/')
	@HttpCode(HttpStatus.OK)
	async create(@Body() body: CreateReviewRequest) {
		const review = await this.service.create(body)
		if (!review) {
			throw new NotFoundException('Product not found')
		}
		return review
	}

	@Delete('/:id')
	async delete(@Param('id') id: number) {
		const deleted = await this.service.delete(id)
		return { deleted }
	}

	@Patch('/:id')
	async update(@Param('id') id: number, @Body() body: UpdateReviewRequest) {
		const review = await this.service.update(id, body)
		if (!review) {
			throw new NotFoundException('Review not found')
		}
		return review
	}
}
