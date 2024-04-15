import { Module } from '@nestjs/common'
import { ProcessingController } from './processing.controller'

@Module({
	controllers: [ProcessingController],
	providers: [],
})
export class ProcessingModule {}
