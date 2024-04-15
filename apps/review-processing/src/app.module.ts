import {
	ClassSerializerInterceptor,
	Module,
	ValidationPipe,
} from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './app.config'
import { AppController } from './app.controller'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true,
			load: [configuration],
		}),
		ClientsModule.registerAsync([{
			name: 'AMQP_CLIENT',
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				transport: Transport.RMQ,
				options: {
					urls: [configService.get<RmqUrl>('amqp')],
				}
			})
		}]),
	],
	controllers: [AppController],
	providers: [
		{
			provide: 'APP_PIPE',
			useValue: new ValidationPipe({ whitelist: true, transform: true }),
		},
		{
			provide: 'APP_INTERCEPTOR',
			useClass: ClassSerializerInterceptor,
		},
	],
})
export class AppModule {}
