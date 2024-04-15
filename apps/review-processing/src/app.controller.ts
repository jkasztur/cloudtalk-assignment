import { Controller, HttpCode, HttpStatus, Get, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { ApiTags } from '@nestjs/swagger'

@Controller('/')
@ApiTags('app')
export class AppController {
	constructor(
	) { }

	@Get('/status')
	@HttpCode(HttpStatus.OK)
	async getStatus() {
		return { ok: true }
	}
}
