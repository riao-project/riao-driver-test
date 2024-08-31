import 'jasmine';
import { Database } from '@riao/dbal';
import { DescriptionColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';
import { loremIpsum } from '../../../mock/lorem-ipsum';

export const descriptionColumnTest = (di: TestDependencies) =>
	describe('Column Pack - DescriptionColumn', () => {
		let db: Database;
		const table = 'description_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a description column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [DescriptionColumn],
			});

			const repo = db.getQueryRepository({ table });

			const description = loremIpsum;

			await repo.insertOne({
				record: { description },
				ignoreReturnId: true,
			});

			const result = await repo.findOne({});

			expect(result.description).toEqual(description);
		});
	});
