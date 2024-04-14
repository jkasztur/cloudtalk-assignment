import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm'

export class Migration1713115426713 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'review',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment',
					},
					{
						name: 'first_name',
						type: 'varchar',
						length: '128',
						isNullable: true,
					},
					{
						name: 'last_name',
						type: 'varchar',
						length: '128',
						isNullable: true,
					},
					{
						name: 'text',
						type: 'varchar',
						length: '1024',
						isNullable: true,
					},
					{
						name: 'rating',
						type: 'int2',
					},
					{
						name: 'product_id',
						type: 'int',
						foreignKeyConstraintName: 'review_product_id_fk',
					},
				],
			}),
		)
		await queryRunner.createForeignKey(
			'review',
			new TableForeignKey({
				columnNames: ['product_id'],
				referencedTableName: 'product',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('product')
	}
}
