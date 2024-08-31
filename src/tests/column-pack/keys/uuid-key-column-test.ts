import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { UUIDKeyColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const uuidKeyColumnTest = (di: TestDependencies) =>
	describe('Column Pack - UUIDKeyColumn', () => {
		let db: Database;
		const table = 'uuid_key_column_test';
		let databaseType: string;

		beforeAll(async () => {
			db = di.db();
		});

		it('can create a uuid key column', async () => {
			databaseType = di.options().name;

			if (
				databaseType.includes('MySQL 5') ||
				databaseType.includes('Sqlite')
			) {
				console.warn(
					'Database does not support UUIDKeyColumn: ',
					databaseType
				);
				return;
			}

			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [
					UUIDKeyColumn,
					{ name: 'number', type: ColumnType.INT },
				],
			});

			const repo = db.getQueryRepository({ table });

			const retval = await repo.insertOne({
				record: { number: 1 },
				primaryKey: 'id',
			});

			const result = await repo.findOne({});

			if (databaseType === 'MySQL 8') {
				console.warn('MySQL 8 does not return UUID keys');
			}
			else {
				expect(retval.id).toEqual(result.id);
				expect(result.id.length).toEqual(36);
			}
		});
	});
