import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { TestDependencies } from '../../../dependency-injection';
import { NameColumn } from '@riao/dbal/column-pack';

export const jsonTest = (di: TestDependencies) =>
	describe('Data Types - JSON', () => {
		let db: Database;
		const table = 'json_test';

		beforeAll(async () => {
			db = di.db();

			await db.ddl.dropTable({
				tables: [table],
				ifExists: true,
			});

			await db.ddl.createTable({
				name: table,
				columns: [
					NameColumn,
					{
						name: 'json_val',
						type: ColumnType.JSON,
					},
				],
			});
		});

		it('can insert json object', async () => {
			const name = 'insert_object_test';
			const testObj = { a: 1, b: 'two', c: true };

			await db.query.insert({
				table,
				records: [{ name, json_val: testObj }],
			});

			const records = await db.query.find({
				table,
				where: { name },
			});

			expect(records.length).toEqual(1);
			expect(records[0].json_val).toEqual(testObj);
		});

		it('can insert json array', async () => {
			const name = 'insert_array_test';
			const testArray = [1, 'two', { c: true }];

			await db.query.insert({
				table,
				records: [{ name, json_val: testArray }],
			});

			const records = await db.query.find({
				table,
				where: { name },
			});

			expect(records.length).toEqual(1);
			expect(records[0].json_val).toEqual(testArray);
		});

		it('can insert null value', async () => {
			const name = 'insert_null_test';

			await db.query.insert({
				table,
				records: [{ name, json_val: null }],
			});

			const records = await db.query.find({
				table,
				where: { name },
			});

			expect(records.length).toEqual(1);
			expect(records[0].json_val).toBeNull();
		});

		it('supports json null values', async () => {
			const name = 'json_null_value_test';
			const testObj = { a: null };

			await db.query.insert({
				table,
				records: [{ name, json_val: testObj }],
			});

			const records = await db.query.find({
				table,
				where: { name },
			});

			expect(records.length).toEqual(1);
			expect(records[0].json_val).toEqual(testObj);
			expect(records[0].json_val.a).toBeNull();
		});

		it('supports nested json objects', async () => {
			const name = 'nested_json_test';
			const testObj = { a: { b: { c: 'nested' } } };

			await db.query.insert({
				table,
				records: [{ name, json_val: testObj }],
			});

			const records = await db.query.find({
				table,
				where: { name },
			});

			expect(records.length).toEqual(1);
			expect(records[0].json_val).toEqual(testObj);
			expect(records[0].json_val.a.b.c).toEqual('nested');
		});

		it('supports json string values', async () => {
			const name = 'json_string_test';
			const testObj = { a: 'This is a string with special characters: \'"\\' };
			
			await db.query.insert({
				table,
				records: [{ name, json_val: testObj }],
			});

			const records = await db.query.find({
				table,
				where: { name },
			});

			expect(records.length).toEqual(1);
			expect(records[0].json_val).toEqual(testObj);
			expect(records[0].json_val.a).toEqual('This is a string with special characters: \'"\\');
		});

		it('supports json boolean values', async () => {
			const name = 'json_boolean_test';
			const testObj = { a: true, b: false };

			await db.query.insert({
				table,
				records: [{ name, json_val: testObj }],
			});

			const records = await db.query.find({
				table,
				where: { name },
			});

			expect(records.length).toEqual(1);
			expect(records[0].json_val).toEqual(testObj);
			expect(records[0].json_val.a).toEqual(true);
			expect(records[0].json_val.b).toEqual(false);
		});

		it('supports json numeric values', async () => {
			const name = 'json_numeric_test';
			const testObj = { a: 123, b: 45.67 };

			await db.query.insert({
				table,
				records: [{ name, json_val: testObj }],
			});

			const records = await db.query.find({
				table,
				where: { name },
			});

			expect(records.length).toEqual(1);
			expect(records[0].json_val).toEqual(testObj);
			expect(records[0].json_val.a).toEqual(123);
			expect(records[0].json_val.b).toEqual(45.67);
		});
		

		it('can insert and retrieve json values by id', async () => {
			const table = 'json_id_test';

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.INT,
						name: 'id',
						primaryKey: true,
					},
					{
						type: ColumnType.JSON,
						name: 'json_val',
					},
				],
			});

			const testObject = { status: 'active', priority: 'high' };
			const inactiveObject = { status: 'inactive', priority: 'low' };

			await db.query.insert({
				table,
				records: [
					{ id: 1, json_val: testObject },
					{ id: 2, json_val: inactiveObject },
				],
			});

			const activeRecords = await db.query.find({
				table,
				where: { id: 1 },
			});

			expect(activeRecords.length).toEqual(1);
			expect(activeRecords[0].id).toEqual(1);
			expect(activeRecords[0].json_val).toEqual(testObject);
		});

		it('can update json values', async () => {
			const table = 'json_update_test';
			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.INT,
						name: 'id',
						primaryKey: true,
					},
					{
						type: ColumnType.JSON,
						name: 'json_val',
					},
				],
			});

			const initialObject = { score: 10, level: 1 };
			const updatedObject = { score: 20, level: 2, bonus: true };
			await db.query.insert({
				table,
				records: [{ id: 1, json_val: initialObject }],
			});

			await db.query.update({
				table,
				set: { json_val: updatedObject },
				where: { id: 1 },
			});

			const records = await db.query.find({ table, where: { id: 1 } });

			expect(records.length).toEqual(1);
			expect(records[0].json_val).toEqual(updatedObject);
		});

		it('can handle complex nested json', async () => {
			const table = 'json_nested_test';

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.INT,
						name: 'id',
						primaryKey: true,
					},
					{
						type: ColumnType.JSON,
						name: 'json_val',
					},
				],
			});

			const complexObject = {
				user: {
					profile: {
						name: 'Jane Doe',
						email: 'jane@example.com',
						preferences: {
							theme: 'dark',
							notifications: true,
							languages: ['en', 'es', 'fr'],
						},
					},
					stats: {
						loginCount: 42,
						lastLogin: '2023-01-15T10:30:00Z',
					},
				},
				metadata: {
					version: '1.2.3',
					tags: ['important', 'user-data'],
				},
			};

			await db.query.insert({
				table,
				records: [{ id: 1, json_val: complexObject }],
			});

			const records = await db.query.find({ table });

			expect(records.length).toEqual(1);
			expect(records[0].json_val).toEqual(complexObject);
		});

		it('supports default null', async () => {
			const table = 'json_default_null_test';

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.INT,
						name: 'id',
						primaryKey: true,
					},
					{
						type: ColumnType.JSON,
						name: 'json_val',
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
			expect(records[0].json_val).toBeNull();
		});
	});