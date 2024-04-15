import { RedisLockModule } from '@huangang/nestjs-simple-redis-lock'
import { RedisLockAsyncOptions } from '@huangang/nestjs-simple-redis-lock/dist/interfaces/redisLockOptions.interface'
import { Module, DynamicModule } from '@nestjs/common'

@Module({})
export class RedisLockerModule {
	static forRootAsync(options: RedisLockAsyncOptions): DynamicModule {
		return {
			module: RedisLockerModule,
			imports: [RedisLockModule.registerAsync(options)],
			exports: [RedisLockModule],
			global: true,
		}
	}
}
