import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './product.entity'
import { ProductsRepository } from './products.repository'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { ReviewsModule } from 'src/reviews/reviews.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([Product]),
		forwardRef(() => ReviewsModule)
	],
	providers: [ProductsRepository, ProductsService],
	controllers: [ProductsController],
	exports: [ProductsService],
})
export class ProductsModule {}
