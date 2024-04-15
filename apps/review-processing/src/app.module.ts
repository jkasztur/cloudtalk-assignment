import {
	ClassSerializerInterceptor,
	Module,
	ValidationPipe,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import configuration from './app.config'
import { AppController } from './app.controller'
import { ProcessingModule } from './processing/processing.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true,
			load: [configuration],
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
