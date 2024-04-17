import { INestApplication } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

// DB helpers

export async function dbTruncate(app: INestApplication) {
	const dataSource = app.get(DataSource)
	for (const entity of dataSource.entityMetadatas) {
		const repository = dataSource.getRepository(entity.name)
		await repository.query(`TRUNCATE TABLE ${entity.tableName} CASCADE`)
	}
}

export async function dbMigrate(app: INestApplication) {
	const dataSource = app.get(DataSource)
	await dataSource.runMigrations()
}

export function getRepository<T>(
	app: INestApplication,
	entityName: string,
): Repository<T> {
	const dataSource = app.get(DataSource)
	const repository = dataSource.getRepository(entityName)
	if (!repository) {
		throw new Error('Wrong entity name')
	}
	return repository as any
}
