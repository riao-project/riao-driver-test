import 'jasmine';
import { ColumnType, Database, DatabaseFunctions } from '@riao/dbal';
import { TestDependencies } from '../../dependency-injection';

export const uuidTest = (di: TestDependencies) =>
	describe('Data Types - UUID', () => {
		let db: Database;
		const table = 'uuid_test';

		beforeAll(async () => {
			db = di.db();

			if (di.options().name.includes('Postgres 12')) {
				console.warn(
					'UUID: Postgres 12 requires enabling "pgcrypto" extension'
				);
				await db.driver.query({ sql: 'CREATE EXTENSION pgcrypto' });
			}
		});

		it('supports uuid column', async () => {
			const databaseType = di.options().name;

			if (
				databaseType.includes('MySQL 5') ||
				databaseType.includes('Sqlite')
			) {
				console.warn('Database does not support UUID: ', databaseType);
				return;
			}

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.UUID,
						name: 'uuid_col',
						default: DatabaseFunctions.uuid(),
						primaryKey: true,
					},
					{
						type: ColumnType.VARCHAR,
						length: 255,
						name: 'name',
					},
				],
			});

			await db.query.insert({
				table,
				records: [{ name: 'Bob' }, { name: 'Tom' }],
			});

			const records = await db.query.find({
				table,
			});

			expect(records.length).toEqual(2);
			expect(records[0].uuid_col.length).toEqual(36);
			expect(records[0].uuid_col).not.toMatch(records[1].uuid_col);

			const foundById = await db
				.getQueryRepository({ table, identifiedBy: 'uuid_col' })
				.findById(records[0].uuid_col);

			expect(foundById.uuid_col.length).toEqual(36);
			expect(foundById.uuid_col).toMatch(records[0].uuid_col);
		});
	});
