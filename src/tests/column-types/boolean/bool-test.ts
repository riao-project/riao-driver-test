import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { TestDependencies } from '../../../dependency-injection';

export const boolTest = (di: TestDependencies) =>
	describe('Data Types - Bool', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
		});
		it('supports bool column', async () => {
			const table = getTableName('');

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.BOOL,
						name: 'is_a_bool',
					},
				],
			});

			await db.query.insert({
				table,
				records: [{ is_a_bool: true }, { is_a_bool: false }],
			});

			const truthyRecords = await db.query.find({
				table,
				where: {
					is_a_bool: true,
				},
			});

			expect(truthyRecords.length).toEqual(1);
			expect(truthyRecords[0].is_a_bool).toBeTruthy();

			const falsyRecords = await db.query.find({
				table,
				where: {
					is_a_bool: false,
				},
			});

			expect(falsyRecords.length).toEqual(1);
			expect(falsyRecords[0].is_a_bool).toBeFalsy();
		});

		it('supports default true', async () => {
			const table = getTableName('default_true');

			await db.ddl.createTable({
				name: table,
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
				table,
				records: [{ id: 1 }],
			});

			const records = await db.query.find({ table });

			expect(records.length).toEqual(1);
			expect(records[0].is_a_bool).toBeTruthy();
		});

		it('supports default false', async () => {
			const table = getTableName('default_false');

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.INT,
						name: 'id',
						primaryKey: true,
					},
					{
						type: ColumnType.BOOL,
						name: 'is_a_bool',
						default: false,
					},
				],
			});

			await db.query.insert({
				table,
				records: [{ id: 1 }],
			});

			const records = await db.query.find({ table });

			expect(records.length).toEqual(1);
			expect(records[0].is_a_bool).toBeFalsy();
		});

		it('supports default null', async () => {
			const table = getTableName('default_null');

			await db.ddl.createTable({
				name: table,
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
				table,
				records: [{ id: 1 }],
			});

			const records = await db.query.find({ table });

			expect(records.length).toEqual(1);
			expect(records[0].is_a_bool).toBeNull();
		});

		function getTableName(name: string) {
			return `columns_boolean_bool_${name}`;
		}
	});
