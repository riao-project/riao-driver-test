import 'jasmine';
import { Database } from '@riao/dbal';
import { FirstNameColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const firstNameColumnTest = (di: TestDependencies) =>
	describe('Column Pack - FirstNameColumn', () => {
		let db: Database;
		const table = 'first_name_column';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a first name column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [FirstNameColumn],
			});

			const repo = db.getQueryRepository({ table });

			await repo.insertOne({
				record: { first_name: 'John' },
				ignoreReturnId: true,
			});

			const result = await repo.findOne({});

			expect(result.first_name).toEqual('John');
		});
	});
