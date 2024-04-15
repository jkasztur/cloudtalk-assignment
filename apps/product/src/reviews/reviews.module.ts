import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Review } from './review.entity'
import { ReviewsController } from './reviews.controller'
import { ProductsModule } from 'src/products/products.module'
import { ReviewsRepository } from './reviews.repository'
import { ReviewsService } from './reviews.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface'

@Module({
	imports: [
		TypeOrmModule.forFeature([Review]),
		ClientsModule.registerAsync([
			{
				name: 'RP_QUEUE',
				imports: [ConfigModule],
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.get<RmqUrl>('amqp')],
						queue: 'review-processing',
					},
				}),
			},
		]),
		ProductsModule,
	],
	providers: [ReviewsRepository, ReviewsService],
	controllers: [ReviewsController],
})
export class ReviewsModule {}
