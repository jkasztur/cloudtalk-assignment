import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../src/app.module'
import { dbMigrate, dbTruncate } from './helpers'
import { ProductsService } from 'src/products/products.service'
import { ReviewsRepository } from 'src/reviews/reviews.repository'

describe('/reviews', () => {
	let app: INestApplication
	let productService: ProductsService
	let repository: ReviewsRepository

	const fullProduct = {
		name: 'Satisfactory',
		description: 'Factory simulator game',
		price: 100,
	}

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleFixture.createNestApplication()
		productService = app.get(ProductsService)
		repository = app.get(ReviewsRepository)
		await app.init()
		await dbMigrate(app)
	})

	beforeEach(async () => {
		await dbTruncate(app)
	})

	afterAll(async () => {
		await app.close()
	})

	describe('POST /', () => {
		test('should create review for existing product', async () => {
			const product = await productService.create(fullProduct)
			const response = await request(app.getHttpServer())
				.post('/reviews')
				.send({ productId: product.id, rating: 2 })
				.expect(200)
			expect(response.body).toMatchObject({
				id: expect.any(Number),
				productId: product.id,
				rating: 2,
			})
			await expect(repository.get(response.body.id)).resolves.toBeTruthy()
		})
	})

	// TODO: add more cases
})
