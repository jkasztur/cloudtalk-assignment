import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateReviewRequest } from './reviews.dto'
import { ReviewsService } from './reviews.service'

@Controller('/reviews')
@ApiTags('reviews')
export class ReviewsController {
	constructor(private service: ReviewsService) {}

	@Post('/')
	@HttpCode(HttpStatus.OK)
	create(@Body() body: CreateReviewRequest) {
		return this.service.create(body)
	}
}
