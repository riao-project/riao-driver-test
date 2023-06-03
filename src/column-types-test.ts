import 'jasmine';
import { ColumnType, Database, QueryRepository } from 'riao-dbal/src';
import { TestOptions } from './test-options';
import { getDatabase } from './init';

export const columnTypesTest = (options: TestOptions) =>
	describe(options.name + ' Data Types', () => {
		let db: Database;

		beforeAll(async () => {
			db = await getDatabase(options);

			await db.ddl.dropTable({
				tables: ['bool_column_test'],
				ifExists: true,
			});
		});

		it('supports bool column', async () => {
			await db.ddl.createTable({
				name: 'bool_column_test',
				columns: [
					{
						type: ColumnType.BOOL,
						name: 'is_a_bool',
					},
				],
			});

			await db.query.insert({
				table: 'bool_column_test',
				records: [{ is_a_bool: true }, { is_a_bool: false }],
			});

			const truthyRecords = await db.query.find({
				table: 'bool_column_test',
				where: {
					is_a_bool: true,
				},
			});

			expect(truthyRecords.length).toEqual(1);
			expect(truthyRecords[0].is_a_bool).toBeTruthy();

			const falsyRecords = await db.query.find({
				table: 'bool_column_test',
				where: {
					is_a_bool: false,
				},
			});

			expect(falsyRecords.length).toEqual(1);
			expect(falsyRecords[0].is_a_bool).toBeFalsy();
		});
	});
