import {
	ClassSerializerInterceptor,
	Module,
	ValidationPipe,
} from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import configuration, { Config } from './app.config'
import { ProductsModule } from './products/products.module'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { AppController } from './app.controller'
import { ReviewsModule } from './reviews/reviews.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true,
			load: [configuration],
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService<Config>) => ({
				...configService.get('postgres'),
				migrations: [__dirname + '/migrations/*.{ts,js}'],
				migrationsRun: true,
				namingStrategy: new SnakeNamingStrategy(),
				autoLoadEntities: true,
			}),
		}),
		ProductsModule,
		ReviewsModule,
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
