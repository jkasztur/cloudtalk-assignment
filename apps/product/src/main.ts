import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const schema = new DocumentBuilder()
		.setTitle('Product Service API')
		.setDescription('Public API for product service')
		.setVersion('1.0.0')
		.build()
	const document = SwaggerModule.createDocument(app, schema)
	SwaggerModule.setup('api', app, document)

	await app.listen(80)
}
bootstrap()
