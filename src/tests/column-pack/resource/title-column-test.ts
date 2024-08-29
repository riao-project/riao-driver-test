import 'jasmine';
import { Database } from '@riao/dbal';
import { TitleColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const titleColumnTest = (di: TestDependencies) =>
	describe('Column Pack - TitleColumn', () => {
		let db: Database;
		const table = 'title_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a title column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [TitleColumn],
			});

			const repo = db.getQueryRepository({ table });

			const title =
				'Innovative Software Solutions for Modern Businesses: Leveraging AI, Marketing Strategies, and Cutting-Edge Technology to Drive Success and Growth in the Digital Age';

			await repo.insertOne({
				record: { title },
				ignoreReturnId: true,
			});

			const result = await repo.findOne({});

			expect(result.title).toEqual(title);
		});
	});
