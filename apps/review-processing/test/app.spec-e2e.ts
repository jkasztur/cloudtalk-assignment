import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../src/app.module'

describe('/', () => {
	let app: INestApplication

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()
	})

	afterAll(async () => {
		await app.close()
	})

	test('GET /status (200)', () => {
		return request(app.getHttpServer())
			.get('/status')
			.expect(200)
			.expect({ ok: true })
	})

	test('GET /unknown (404)', () => {
		return request(app.getHttpServer()).get('/unknown').expect(404)
	})
})
