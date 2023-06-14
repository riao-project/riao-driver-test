import 'jasmine';
import { ColumnType, Database } from 'riao-dbal/src';
import { TestOptions } from '../../test-options';
import { getDatabase } from '../../init';

export const boolTest = (options: TestOptions) =>
	describe(options.name + ' Data Types - Bool', () => {
		let db: Database;

		beforeAll(async () => {
			db = await getDatabase(options);

			await db.ddl.dropTable({
				tables: [
					'bool_column_test',
					'bool_true_column_test',
					'bool_false_column_test',
					'bool_null_column_test',
				],
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

		it('supports default true', async () => {
			await db.ddl.createTable({
				name: 'bool_true_column_test',
				columns: [
					{
						type: ColumnType.INT,
						name: 'id',
						primaryKey: true,
					},
					{
						type: ColumnType.BOOL,
						name: 'is_a_bool',
						default: true,
					},
				],
			});

			await db.query.insert({
				table: 'bool_true_column_test',
				records: [{ id: 1 }],
			});

			const records = await db.query.find({
				table: 'bool_true_column_test',
			});

			expect(records.length).toEqual(1);
			expect(records[0].is_a_bool).toBeTruthy();
		});

		it('supports default null', async () => {
			await db.ddl.createTable({
				name: 'bool_null_column_test',
				columns: [
					{
						type: ColumnType.INT,
						name: 'id',
						primaryKey: true,
					},
					{
						type: ColumnType.BOOL,
						name: 'is_a_bool',
						default: null,
					},
				],
			});

			await db.query.insert({
				table: 'bool_null_column_test',
				records: [{ id: 1 }],
			});

			const records = await db.query.find({
				table: 'bool_null_column_test',
			});

			expect(records.length).toEqual(1);
			expect(records[0].is_a_bool).toBeNull();
		});
	});