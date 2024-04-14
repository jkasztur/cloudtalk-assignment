import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class Migration1713097982366 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'product',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment',
					},
					{
						name: 'name',
						type: 'varchar',
						length: '128',
					},
					{
						name: 'description',
						type: 'varchar',
						length: '256',
					},
					{
						name: 'price',
						type: 'float',
					},
				],
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('product')
	}
}
