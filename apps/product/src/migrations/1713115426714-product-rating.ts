import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class Migration1713115426714 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			'product',
			new TableColumn({
				name: 'average_rating',
				type: 'float',
				isNullable: true,
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('product', 'average_rating')
	}
}
