import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../src/app.module'
import { dbMigrate, dbTruncate } from './helpers'
import omit from 'object.omit'
import { ProductsRepository } from 'src/products/products.repository'

describe('/products', () => {
	let app: INestApplication
	let repository: ProductsRepository

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
		repository = app.get(ProductsRepository)
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
		test('should create product', async () => {
			const response = await request(app.getHttpServer())
				.post('/products')
				.send(fullProduct)
				.expect(200)
			expect(response.body).toMatchObject({
				id: expect.any(Number),
				...fullProduct,
			})
			await expect(repository.get(response.body.id)).resolves.toBeTruthy()
		})

		test.each([
			['empty name', omit(fullProduct, 'name')],
			['empty description', omit(fullProduct, 'description')],
			['empty price', omit(fullProduct, 'price')],
		])('should not create product with %s', async (name: string, data: any) => {
			await request(app.getHttpServer())
				.post('/products')
				.send(data)
				.expect(400)
		})
	})

	describe('DELETE /:id', () => {
		test('should delete product if exists', async () => {
			const product = await repository.create(fullProduct)
			await request(app.getHttpServer())
				.delete(`/products/${product.id}`)
				.expect(200)
				.expect({ deleted: true })
			await expect(repository.get(product.id)).resolves.toBeFalsy()
		})

		test('should return false if product doesnt exist', async () => {
			await request(app.getHttpServer())
				.delete(`/products/666`)
				.expect(200)
				.expect({ deleted: false })
		})
	})

	describe('PATCH /:id', () => {
		test('should update product', async () => {
			const product = await repository.create(fullProduct)
			await request(app.getHttpServer())
				.patch(`/products/${product.id}`)
				.send({ name: 'Factorio' })
				.expect(200)
				.expect({
					id: product.id,
					name: 'Factorio',
					description: product.description,
					price: product.price,
				})
		})

		test('should return 404 if product doesnt exist', async () => {
			await request(app.getHttpServer())
				.patch(`/products/666`)
				.send({ name: 'New name' })
				.expect(404)
		})

		test('should return 400 if no fields to update', async () => {
			const product = await repository.create(fullProduct)
			await request(app.getHttpServer())
				.patch(`/products/${product.id}`)
				.send({})
				.expect(400)
		})
	})

	describe('GET /:id', () => {
		test('should return product if exists', async () => {
			const product = await repository.create(fullProduct)
			await request(app.getHttpServer())
				.get(`/products/${product.id}`)
				.expect(200)
				.expect({
					id: product.id,
					...fullProduct,
				})
		})

		test('should return 404 if product doesnt exist', async () => {
			await request(app.getHttpServer()).get(`/products/666`).expect(404)
		})
	})
})
