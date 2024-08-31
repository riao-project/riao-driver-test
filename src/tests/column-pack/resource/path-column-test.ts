import 'jasmine';
import { Database } from '@riao/dbal';
import { PathColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const pathColumnTest = (di: TestDependencies) =>
	describe('Column Pack - Path', () => {
		let db: Database;
		const table = 'path_column';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a path column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [PathColumn],
			});

			const repo = db.getQueryRepository({ table });

			const path =
				'really-extra-long-path-name-for-testing-purposes-but-probably-unrealistic-of-course';

			await repo.insertOne({ record: { path }, ignoreReturnId: true });

			const result = await repo.findOne({});

			expect(result.path).toEqual(
				'really-extra-long-path-name-for-testing-purposes-but-probably-unrealistic-of-course'
			);
		});
	});
