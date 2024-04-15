import {
	ClassSerializerInterceptor,
	Module,
	ValidationPipe,
} from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './app.config'
import { AppController } from './app.controller'
import { ProcessingModule } from './processing/processing.module'
import { RedisModule, RedisService } from '@songkeys/nestjs-redis'
import { RedisLockerModule } from './redis/redis-locker.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true,
			load: [configuration],
		}),
		RedisModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				commonOptions: {
					lazyConnect: false,
				},
				config: {
					...configService.get('redis'),
					maxRetriesPerRequest: 1,
					showFriendlyErrorStack: true,
				},
			}),
		}),
		RedisLockerModule.forRootAsync({
			useFactory: (redisService: RedisService) => ({
				client: redisService.getClient(),
			}),
			inject: [RedisService],
		}),
		ProcessingModule,
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
