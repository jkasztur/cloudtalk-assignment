import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './product.entity'
import { ProductsRepository } from './products.repository'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { ReviewsModule } from 'src/reviews/reviews.module'
import { ProductRatingService } from './product-rating.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Product]),
		forwardRef(() => ReviewsModule),
	],
	providers: [ProductsRepository, ProductsService, ProductRatingService],
	controllers: [ProductsController],
	exports: [ProductsService],
})
export class ProductsModule {}
