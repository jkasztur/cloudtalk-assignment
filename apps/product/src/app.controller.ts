import { Controller, HttpCode, HttpStatus, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@Controller('/')
@ApiTags('app')
export class AppController {
	constructor() {}

	@Get('/status')
	@HttpCode(HttpStatus.OK)
	async getStatus() {
		return { ok: true }
	}
}
