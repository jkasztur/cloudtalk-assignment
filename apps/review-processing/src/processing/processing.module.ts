import { Module } from '@nestjs/common'
import { ProcessingController } from './processing.controller'
import { ProcessingService } from './processing.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface'

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: 'PRODUCT_QUEUE',
				imports: [ConfigModule],
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.get<RmqUrl>('amqp')],
						queue: 'product',
					},
				}),
			},
		]),
	],
	controllers: [ProcessingController],
	providers: [ProcessingService],
})
export class ProcessingModule {}
