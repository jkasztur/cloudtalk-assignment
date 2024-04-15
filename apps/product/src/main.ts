import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const configService = app.get(ConfigService)
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: [configService.get<RmqUrl>('amqp')],
		}
	})

	const schema = new DocumentBuilder()
		.setTitle('Product Service API')
		.setDescription('Public API for product service')
		.setVersion('1.0.0')
		.build()
	const document = SwaggerModule.createDocument(app, schema)
	SwaggerModule.setup('api', app, document)

	await app.startAllMicroservices()
	await app.listen(80)
}
bootstrap()
