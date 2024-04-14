import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Review } from './review.entity'
import { ReviewsController } from './reviews.controller'
import { ProductsModule } from 'src/products/products.module'
import { ReviewsRepository } from './reviews.repository'
import { ReviewsService } from './reviews.service'

@Module({
	imports: [TypeOrmModule.forFeature([Review]), ProductsModule],
	providers: [ReviewsRepository, ReviewsService],
	controllers: [ReviewsController],
})
export class ReviewsModule {}
