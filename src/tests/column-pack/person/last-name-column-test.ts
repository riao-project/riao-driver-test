import 'jasmine';
import { Database } from '@riao/dbal';
import { LastNameColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const lastNameColumnTest = (di: TestDependencies) =>
	describe('Column Pack - LastNameColumn', () => {
		let db: Database;
		const table = 'last_name_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a last name column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [LastNameColumn],
			});

			const repo = db.getQueryRepository({ table });

			await repo.insertOne({
				record: { last_name: 'O\'Shaughnessy' },
				ignoreReturnId: true,
			});

			const result = await repo.findOne({});

			expect(result.last_name).toEqual('O\'Shaughnessy');
		});
	});
